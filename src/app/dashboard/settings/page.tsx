'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';

export default function Settings() {
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        autoSync: true,
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

                    <div className="bg-white shadow rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Dark Mode</span>
                            <input
                                type="checkbox"
                                checked={settings.darkMode}
                                onChange={() => handleToggle('darkMode')}
                                className="w-5 h-5 accent-indigo-600"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Notifications</span>
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={() => handleToggle('notifications')}
                                className="w-5 h-5 accent-indigo-600"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">Auto Sync</span>
                            <input
                                type="checkbox"
                                checked={settings.autoSync}
                                onChange={() => handleToggle('autoSync')}
                                className="w-5 h-5 accent-indigo-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
