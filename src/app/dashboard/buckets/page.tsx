"use client";

import { useState, useEffect } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useFolderService } from '@/hooks/useFolderService';
import { Folder } from '@/services/folderService';

export default function BucketsPage() {
    const { isAuthenticated } = useAuth0();
    const { createFolder, getFolders, deleteFolder } = useFolderService();
    const [bucketName, setBucketName] = useState("");
    const [buckets, setBuckets] = useState<Folder[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Load folders on component mount
    useEffect(() => {
        if (isAuthenticated) {
            loadFolders();
        }
    }, [isAuthenticated]);

    const loadFolders = async () => {
        try {
            const response = await getFolders();
            setBuckets(response.folders);
        } catch (error) {
            console.error('Error loading folders:', error);
            setMessage("Failed to load folders");
        }
    };

    const handleCreateBucket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bucketName.trim()) {
            setMessage("Bucket name cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            const response = await createFolder({ name: bucketName });
            setBuckets(prev => [...prev, response.folder]);
            setBucketName("");
            setMessage("Folder created successfully!");
        } catch (error) {
            console.error('Error creating folder:', error);
            setMessage("Failed to create folder");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBucket = async (folderId: string) => {
        if (!confirm("Are you sure you want to delete this folder?")) {
            return;
        }

        try {
            await deleteFolder(folderId);
            setBuckets(prev => prev.filter(bucket => bucket.id !== folderId));
            setMessage("Folder deleted successfully!");
        } catch (error) {
            console.error('Error deleting folder:', error);
            setMessage("Failed to delete folder");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            {/* Dashboard Navigation Bar */}
            <nav className="bg-white shadow-sm mb-6">
                <div className="max-w-2xl mx-auto px-4">
                </div>
            </nav>
            <h1 className="text-3xl font-bold mb-6">Buckets</h1>
            <form onSubmit={handleCreateBucket} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter bucket name"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Bucket'}
                </button>
            </form>
            {message && <div className="mb-4 text-green-600">{message}</div>}
            <ul className="space-y-2">
                {buckets.map((bucket) => (
                    <li key={bucket.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                        <span>{bucket.name}</span>
                        <button
                            onClick={() => handleDeleteBucket(bucket.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
} 