import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { useChatContext } from '../contexts/ChatContext';

const ChatHistory: React.FC = () => {
    const {
        conversations,
        currentConversationId,
        createNewConversation,
        switchConversation,
        deleteConversation,
        renameConversation
    } = useChatContext();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const startEditing = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditingTitle(currentTitle);
    };

    const saveEdit = () => {
        if (editingId && editingTitle.trim()) {
            renameConversation(editingId, editingTitle.trim());
        }
        setEditingId(null);
        setEditingTitle('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingTitle('');
    };

    // Group conversations by date
    const groupedConversations = conversations.reduce((groups, conv) => {
        const dateKey = formatDate(conv.updatedAt);
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(conv);
        return groups;
    }, {} as Record<string, typeof conversations>);

    return (
        <div className="w-72 bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-r border-gray-700/30 flex flex-col h-full relative z-20 shadow-2xl">
            {/* Gradient Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            {/* Header */}
            <div className="p-4 border-b border-gray-700/30">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat History
                </h2>

                {/* New Chat Button */}
                <button
                    onClick={createNewConversation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>New Chat</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                {Object.entries(groupedConversations).map(([dateKey, convs]) => (
                    <div key={dateKey} className="space-y-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 flex items-center gap-2">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-700/50 to-transparent"></div>
                            <span>{dateKey}</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-gray-700/50 to-transparent"></div>
                        </h3>
                        <div className="space-y-1">
                            {convs.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${conv.id === currentConversationId
                                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                        : 'hover:bg-gray-800/50 border border-transparent'
                                        }`}
                                    onClick={() => editingId !== conv.id && switchConversation(conv.id)}
                                >
                                    <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${conv.id === currentConversationId ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'
                                        }`} />

                                    {editingId === conv.id ? (
                                        // Edit Mode
                                        <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEdit();
                                                    if (e.key === 'Escape') cancelEdit();
                                                }}
                                                className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded-lg border border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                                                autoFocus
                                            />
                                            <button
                                                onClick={saveEdit}
                                                className="p-1.5 hover:bg-green-500/20 rounded-lg transition-all"
                                                title="Save"
                                            >
                                                <Check className="w-3.5 h-3.5 text-green-400" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all"
                                                title="Cancel"
                                            >
                                                <X className="w-3.5 h-3.5 text-red-400" />
                                            </button>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <span className={`flex-1 text-sm truncate transition-colors ${conv.id === currentConversationId ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'
                                                }`}>
                                                {conv.title}
                                            </span>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditing(conv.id, conv.title);
                                                    }}
                                                    className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all"
                                                    title="Rename"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 text-blue-400" />
                                                </button>
                                                {conversations.length > 1 && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteConversation(conv.id);
                                                        }}
                                                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>
    );
};


export default ChatHistory;
