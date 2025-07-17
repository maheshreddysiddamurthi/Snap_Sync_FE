'use client';

import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface UserDetails {
    role?: string;
    permissions?: string[];
    picture?: string;
    name?: string;
    email?: string;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
}

export default function Dashboard() {
    const { user, getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    const verifyToken = useCallback(async () => {
        if (!user) return;

        try {
            const token = await getAccessTokenSilently();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        sub: user.sub,
                        email: user.email,
                        name: user.name,
                        nickname: user.nickname,
                        picture: user.picture,
                        email_verified: user.email_verified,
                        updated_at: user.updated_at,
                        firstName,
                        lastName,
                    },
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to verify token');
            }

            const data = await response.json();
            if (data.user) {
                setUserData(data.user);
                setFirstName(data.user.firstName || '');
                setLastName(data.user.lastName || '');
            }
        } catch (err) {
            setError((err as Error).message || 'Failed to verify authentication');
        }
    }, [user, getAccessTokenSilently, firstName, lastName]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    function getInitials(name: string, email: string) {
        if (name) {
            const parts = name
                .split(' ')
                .filter(Boolean); // Remove empty strings
            if (parts.length === 0) return email ? email[0].toUpperCase() : '';
            if (parts.length === 1) return parts[0][0].toUpperCase();
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        if (email) return email[0].toUpperCase();
        return '';
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm mb-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex space-x-8 h-12 items-center">
                            {/* <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link> */}
                            <Link href="/dashboard/buckets" className="text-gray-700 hover:text-blue-600 font-medium">Buckets</Link>
                            {/* <Link href="/dashboard/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link> */}
                        </div>
                    </div>
                </nav>

                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                            {user && (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                                        {/* Avatar with initials fallback for navbar */}
                                        {userData?.picture || user?.picture ? (
                                            <Image
                                                className="h-8 w-8 rounded-full object-cover"
                                                src={userData?.picture || user?.picture || '/default-avatar.png'}
                                                alt={userData?.name || user?.name || 'User'}
                                                width={32}
                                                height={32}
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-base font-semibold">
                                                {getInitials(
                                                    ((userData?.firstName || firstName || '') + ' ' + (userData?.lastName || lastName || '')).trim(),
                                                    userData?.email || user?.email || ''
                                                )}
                                            </div>
                                        )}
                                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/dashboard/profile"
                                                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                                                    >
                                                        Your Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/dashboard/settings"
                                                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                                                    >
                                                        Settings
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/dashboard/subscription"
                                                        className={`block px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-100' : ''}`}
                                                    >
                                                        Subscription
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''}`}
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 shadow-xl">
                                <h1 className="text-4xl font-bold text-white mb-2">Welcome to SnapSync!</h1>
                                <p className="text-xl text-blue-100">
                                    Hello, {userData?.firstName || user?.given_name || user?.nickname || user?.name || 'User'}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                                <div className="flex items-center space-x-4 mb-4">
                                    {/* Avatar with initials fallback */}
                                    {userData?.picture || user?.picture ? (
                                        <Image
                                            src={userData?.picture || user?.picture || 'https://via.placeholder.com/64'}
                                            alt={userData?.name || user?.name || 'User'}
                                            className="w-20 h-20 rounded-full object-cover"
                                            width={80}
                                            height={80}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-semibold">
                                            {getInitials(
                                                ((userData?.firstName || firstName || '') + ' ' + (userData?.lastName || lastName || '')).trim(),
                                                userData?.email || user?.email || ''
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {(userData?.firstName || firstName) + ' ' + (userData?.lastName || lastName)}
                                        </span>
                                        <span className="text-gray-600 text-lg">{userData?.email || user?.email}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={verifyToken}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save Profile
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h2>
                                <p className="text-gray-600">You're signed in as {userData?.role || 'User'}</p>
                            </div>

                            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Status</h3>
                                    <p className="text-green-600 font-medium">Active</p>
                                </div>
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Role</h3>
                                    <p className="text-gray-600">{userData?.role || 'User'}</p>
                                </div>
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Permissions</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {userData?.permissions?.map((permission) => (
                                            <span
                                                key={permission}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {permission}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div> */}

                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                                <p className="text-gray-500 italic">No recent activity to show</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
