import React from 'react';
import MarkdownRenderer from './ui/MarkdownRenderer';


interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
    if (role === 'user') {
        return (
            <div className="flex justify-end animate-slide-up">
                <div className="max-w-[75%] rounded-2xl px-5 py-3.5 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-glow">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start animate-slide-up">
            <div className="max-w-[85%] rounded-2xl px-6 py-4 shadow-lg bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50">
                {/* AI Badge */}
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700/50">
                    <div className="w-6 h-6 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-bold">
                        AI
                    </div>
                    <span className="text-xs font-medium text-gray-400">EduGen Assistant</span>
                </div>

                {/* Markdown Content */}
                <MarkdownRenderer content={content} theme="dark" />
            </div>
        </div>
    );
};

export default MessageBubble;
