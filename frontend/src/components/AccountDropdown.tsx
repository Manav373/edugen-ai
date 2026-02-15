import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface AccountDropdownProps {
    userName?: string;
    userEmail?: string;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({
    userName = 'Student',
    userEmail = 'student@edugen.ai'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // TODO: Implement actual logout logic
        console.log('Logging out...');
        setIsOpen(false);
    };

    const handleProfile = () => {
        // TODO: Navigate to profile page
        console.log('Opening profile...');
        setIsOpen(false);
    };

    const handleSettings = () => {
        // TODO: Navigate to settings page
        console.log('Opening settings...');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group cursor-pointer flex items-center gap-2 focus:outline-none"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>

                {/* Avatar */}
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-glow">
                    {userName.charAt(0).toUpperCase()}
                </div>

                {/* Chevron */}
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 animate-slide-down origin-top-right">
                    <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-glass border border-gray-700/50 overflow-hidden">
                        {/* User Info Section */}
                        <div className="p-4 border-b border-gray-700/50 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-glow">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {userName}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {userEmail}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            {/* Profile */}
                            <button
                                onClick={handleProfile}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                            >
                                <User className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">My Profile</span>
                            </button>

                            {/* Settings */}
                            <button
                                onClick={handleSettings}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                            >
                                <Settings className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Settings</span>
                            </button>

                            {/* Divider */}
                            <div className="my-2 border-t border-gray-700/50"></div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                            >
                                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountDropdown;
