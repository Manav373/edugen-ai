import { BookOpen, Code, FileText, MessageSquare, Settings, Upload, Sparkles, GraduationCap, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
                w-64 sm:w-72 lg:w-56 xl:w-64
                bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 
                border-r border-gray-700/50 flex flex-col h-full 
                overflow-hidden transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>

                {/* Logo Section */}
                <div className="relative p-4 sm:p-6 border-b border-gray-700/50">
                    <div className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-bold gradient-text animate-gradient bg-[length:200%_auto]">
                                EduGen AI
                            </h1>
                            <p className="text-xs text-gray-400 font-medium">Your Learning Assistant</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 sm:p-4 space-y-1.5 relative overflow-y-auto">
                    <SidebarItem
                        icon={<MessageSquare className="w-5 h-5" />}
                        label="Chat Assistant"
                        path="/chat"
                        active={location.pathname === '/chat'}
                        onClick={onClose}
                    />
                    <SidebarItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Assignments"
                        path="/assignments"
                        active={location.pathname === '/assignments'}
                        onClick={onClose}
                    />
                    <SidebarItem
                        icon={<GraduationCap className="w-5 h-5" />}
                        label="Student Questions"
                        path="/student-questions"
                        active={location.pathname === '/student-questions'}
                        onClick={onClose}
                    />
                    <SidebarItem
                        icon={<Code className="w-5 h-5" />}
                        label="Lab Manuals"
                        path="/lab-manuals"
                        active={location.pathname === '/lab-manuals'}
                        onClick={onClose}
                    />
                    <SidebarItem
                        icon={<BookOpen className="w-5 h-5" />}
                        label="Study Materials"
                        path="/materials"
                        active={location.pathname === '/materials'}
                        onClick={onClose}
                    />
                    <SidebarItem
                        icon={<Upload className="w-5 h-5" />}
                        label="Upload Documents"
                        path="/upload"
                        active={location.pathname === '/upload'}
                        onClick={onClose}
                    />
                    <SidebarItem
                        icon={<Brain className="w-5 h-5" />}
                        label="Student Toolkit"
                        path="/tools"
                        active={location.pathname.startsWith('/tools')}
                        onClick={onClose}
                    />
                </nav>

                {/* Settings */}
                <div className="p-3 sm:p-4 border-t border-gray-700/50 relative">
                    <SidebarItem
                        icon={<Settings className="w-5 h-5" />}
                        label="Settings"
                        path="/settings"
                        active={location.pathname === '/settings'}
                        onClick={onClose}
                    />
                </div>
            </div>
        </>
    );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; path: string; active?: boolean; onClick?: () => void }> = ({
    icon,
    label,
    path,
    active,
    onClick
}) => (
    <Link
        to={path}
        onClick={onClick}
        className={`
            relative w-full flex items-center gap-3 px-4 py-3 rounded-xl
            transition-all duration-300 group overflow-hidden
            min-h-[44px] touch-manipulation
            ${active
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white shadow-inner-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
        `}
    >
        {/* Active Indicator */}
        {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-primary rounded-r-full shadow-glow"></div>
        )}

        {/* Icon with Animation */}
        <div className={`
            relative z-10 transition-transform duration-300
            ${active ? 'scale-110' : 'group-hover:scale-110'}
        `}>
            {icon}
        </div>

        {/* Label */}
        <span className={`
            relative z-10 font-medium text-sm
            ${active ? 'font-semibold' : ''}
        `}>
            {label}
        </span>

        {/* Hover Gradient Background */}
        {!active && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
    </Link>
);

export default Sidebar;

