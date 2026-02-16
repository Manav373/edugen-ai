import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    theme?: 'dark' | 'light';
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '', theme = 'dark' }) => {
    return (
        <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''} ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 pb-2 border-b border-gray-700 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent break-words" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 flex items-center gap-2 text-blue-400 break-words" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-purple-400 break-words" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-4 text-gray-300" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 my-4 text-gray-300" {...props} />,
                    li: ({ node, ...props }) => <li className="marker:text-blue-500" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 sm:my-6 bg-blue-500/10 rounded-r-lg italic text-gray-300" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6 rounded-lg border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
                    th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
                    tbody: ({ node, ...props }) => <tbody className="bg-gray-900/50 divide-y divide-gray-800" {...props} />,
                    tr: ({ node, ...props }) => <tr className="hover:bg-gray-800/50 transition-colors" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 text-sm text-gray-300 whitespace-pre-wrap" {...props} />,
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="relative group rounded-lg overflow-hidden my-4 border border-gray-700 shadow-lg">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                                    <span className="text-xs font-mono text-gray-400">{match[1]}</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                    </div>
                                </div>
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, padding: '1.5rem', background: '#0f1117' }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="px-1.5 py-0.5 rounded-md bg-gray-800 text-blue-300 font-mono text-sm border border-gray-700" {...props}>
                                {children}
                            </code>
                        );
                    },
                    a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-8 border-gray-700" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
