import React from 'react';
import { Upload as UploadIcon } from 'lucide-react';

const Upload: React.FC = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <UploadIcon className="w-6 h-6 text-blue-600" />
                Upload Documents
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-600 dark:text-gray-300">
                    Document upload feature coming soon...
                </p>
            </div>
        </div>
    );
};

export default Upload;
