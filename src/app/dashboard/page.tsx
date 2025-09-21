'use client';

import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState, useCallback, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import {
    UserIcon,
    Cog6ToothIcon,
    InboxStackIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

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
    const { user, getAccessTokenSilently, logout } = useAuth0();
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserDetails | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            const parts = name.split(' ').filter(Boolean);
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
                {/* Top Nav */}
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                                <div className="hidden md:flex space-x-4">
                                    <Link href="/dashboard/buckets" className="text-gray-700 hover:text-blue-600 font-medium transition">
                                        Buckets
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                                </button>
                            </div>

                            {/* Avatar Dropdown */}
                            {user && (
                                <Menu as="div" className="relative ml-4">
                                    <Menu.Button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden shadow hover:shadow-lg transition">
                                            {userData?.picture || user?.picture ? (
                                                <Image
                                                    className="object-cover"
                                                    src={userData?.picture || user?.picture || '/default-avatar.png'}
                                                    alt={userData?.name || user?.name || 'User'}
                                                    width={40}
                                                    height={40}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                    <UserIcon className="h-6 w-6" />
                                                </div>
                                            )}
                                            {/* Stylish Pulse Online Status */}
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white shadow-md animate-pulse"></span>
                                        </div>
                                    </Menu.Button>

                                    {/* Floating Sliding Dropdown */}
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-300 transform"
                                        enterFrom="opacity-0 translate-x-8 -translate-y-2"
                                        enterTo="opacity-100 translate-x-0 translate-y-0"
                                        leave="transition ease-in duration-200 transform"
                                        leaveFrom="opacity-100 translate-x-0 translate-y-0"
                                        leaveTo="opacity-0 translate-x-8 -translate-y-2"
                                    >
                                        <Menu.Items className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 focus:outline-none ring-1 ring-black ring-opacity-5">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    {userData?.picture || user?.picture ? (
                                                        <Image
                                                            className="h-12 w-12 rounded-full object-cover"
                                                            src={userData?.picture || user?.picture || '/default-avatar.png'}
                                                            alt="User"
                                                            width={48}
                                                            height={48}
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                            <UserIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">{`${userData?.firstName || firstName || ''} ${userData?.lastName || lastName || ''}`}</span>
                                                        <span className="text-xs text-gray-500">{userData?.email || user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/dashboard/profile"
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg transition ${active ? 'bg-gray-100' : ''}`}
                                                        >
                                                            <UserIcon className="h-5 w-5 text-gray-500" /> Your Profile
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/dashboard/settings"
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg transition ${active ? 'bg-gray-100' : ''}`}
                                                        >
                                                            <Cog6ToothIcon className="h-5 w-5 text-gray-500" /> Settings
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/dashboard/subscription"
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 rounded-lg transition ${active ? 'bg-gray-100' : ''}`}
                                                        >
                                                            <InboxStackIcon className="h-5 w-5 text-gray-500" /> Subscription
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={handleLogout}
                                                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 rounded-lg transition ${active ? 'bg-gray-100' : ''}`}
                                                        >
                                                            <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" /> Logout
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu links */}
                    {mobileMenuOpen && (
                        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white shadow">
                            <Link href="/dashboard/buckets" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                                Buckets
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Page Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-xl">
                                <h1 className="text-4xl font-bold text-white mb-2">Welcome to SnapSync!</h1>
                                <p className="text-xl text-blue-100">
                                    Hello, {(userData?.firstName || firstName || '') + ' ' + (userData?.lastName || lastName || '') || user?.given_name || user?.nickname || user?.name || 'User'}
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
