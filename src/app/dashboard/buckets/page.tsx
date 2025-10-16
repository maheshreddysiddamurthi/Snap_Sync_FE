"use client";

import { useState } from "react";
import Link from 'next/link';

export default function BucketsPage() {
    const [bucketName, setBucketName] = useState("");
    const [buckets, setBuckets] = useState([
        { id: 1, name: "Personal" },
        { id: 2, name: "Work" },
    ]); // Mocked data for now
    const [message, setMessage] = useState("");

    const handleCreateBucket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bucketName.trim()) {
            setMessage("Bucket name cannot be empty.");
            return;
        }
        // For now, just add to local state
        setBuckets((prev) => [
            ...prev,
            { id: Date.now(), name: bucketName }
        ]);
        setBucketName("");
        setMessage("Bucket created (mocked, not saved to server yet)");
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Create Bucket
                </button>
            </form>
            {message && <div className="mb-4 text-green-600">{message}</div>}
            <ul className="space-y-2">
                {buckets.map((bucket) => (
                    <li key={bucket.id} className="p-3 bg-gray-100 rounded-md">
                        {bucket.name}
                    </li>
                ))}
            </ul>
        </div>
    );
} 