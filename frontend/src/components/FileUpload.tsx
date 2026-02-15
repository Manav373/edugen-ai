import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, File, Loader2 } from 'lucide-react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isUploading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isUploading = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedTypes = {
        'application/pdf': ['.pdf'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png'],
        'text/plain': ['.txt'],
    };

    const maxSize = 10 * 1024 * 1024; // 10MB

    const validateFile = (file: File): boolean => {
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            return false;
        }

        const isValidType = Object.keys(acceptedTypes).includes(file.type);
        if (!isValidType) {
            alert('Please upload PDF, Image (JPG/PNG), or Text files only');
            return false;
        }

        return true;
    };

    const handleFileSelect = (file: File) => {
        if (validateFile(file)) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-purple-400" />;
        if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-400" />;
        return <File className="w-8 h-8 text-blue-400" />;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                        transition-all duration-300
                        ${isDragging
                            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                            : 'border-gray-600 hover:border-blue-500/50 hover:bg-gray-800/50'
                        }
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleInputChange}
                        accept={Object.values(acceptedTypes).flat().join(',')}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full">
                            <Upload className="w-8 h-8 text-blue-400" />
                        </div>

                        <div>
                            <p className="text-white font-medium mb-1">
                                Drop your assignment here or click to browse
                            </p>
                            <p className="text-gray-400 text-sm">
                                PDF, Images (JPG, PNG), or Text files • Max 10MB
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative border border-gray-700 rounded-xl p-4 bg-gray-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            {getFileIcon(selectedFile.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>

                        {isUploading ? (
                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                        ) : (
                            <button
                                onClick={clearFile}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0"
                                title="Remove file"
                            >
                                <X className="w-5 h-5 text-red-400" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
