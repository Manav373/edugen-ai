import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <SettingsIcon className="w-6 h-6 text-gray-600" />
                Settings
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-600 dark:text-gray-300">
                    Settings configuration coming soon...
                </p>
            </div>
        </div>
    );
};

export default Settings;
