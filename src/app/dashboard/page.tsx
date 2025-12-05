'use client';

import { useAuth0 } from '@auth0/auth0-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState, useCallback, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition, Menu } from '@headlessui/react';
import {
    UserIcon,
    Cog6ToothIcon,
    InboxStackIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    FolderPlusIcon
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
    const [bucketModalOpen, setBucketModalOpen] = useState(false);
    const [bucketName, setBucketName] = useState('');
    const [bucketType, setBucketType] = useState<'self' | 'group'>('self');
    const [loading, setLoading] = useState(false);

    const verifyToken = useCallback(async () => {
        if (!user) return;
        try {
            const token = await getAccessTokenSilently();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/profile/sync`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
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
                const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
                throw new Error(errorData.error || `Failed to fetch user profile: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.user) {
                setUserData(data.user);
                setFirstName(data.user.firstName || '');
                setLastName(data.user.lastName || '');
                setError(null);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to verify authentication';
            console.error('Token verification error:', error);
            setError(errorMessage);
        }
    }, [user, getAccessTokenSilently, firstName, lastName]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const handleCreateFolder = async () => {
        if (!bucketName.trim()) {
            alert('Please enter a folder name');
            return;
        }
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/create-folder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: bucketName, parentFolderId: null }),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`✅ Folder "${data.folder.name}" created successfully!`);
                setBucketModalOpen(false);
                setBucketName('');
            } else {
                alert(`❌ ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            alert('Something went wrong while creating the folder');
        } finally {
            setLoading(false);
        }
    };

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
                                    <button
                                        onClick={() => setBucketModalOpen(true)}
                                        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition"
                                    >
                                        <FolderPlusIcon className="h-5 w-5 text-blue-500" />
                                        Buckets
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex md:hidden">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {mobileMenuOpen ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </button>
                            </div>

                            {/* Avatar Dropdown */}
                            {user && (
                                <Menu as="div" className="relative ml-4">
                                    <Menu.Button className="flex items-center rounded-full focus:outline-none">
                                        <div className="relative h-10 w-10 rounded-full overflow-hidden shadow">
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
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white shadow-sm"></span>
                                        </div>
                                    </Menu.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 focus:outline-none">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={userData?.picture || user?.picture || '/default-avatar.png'}
                                                        alt="User"
                                                        width={48}
                                                        height={48}
                                                    />
                                                    <div>
                                                        <span className="block text-sm font-semibold text-gray-900">{`${userData?.firstName || firstName} ${userData?.lastName || lastName}`}</span>
                                                        <span className="block text-xs text-gray-500">
                                                            {userData?.email || user?.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/dashboard/profile"
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
                                                                }`}
                                                        >
                                                            <UserIcon className="h-5 w-5 text-gray-500" /> Profile
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/dashboard/settings"
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
                                                                }`}
                                                        >
                                                            <Cog6ToothIcon className="h-5 w-5 text-gray-500" /> Settings
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/dashboard/subscription"
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''
                                                                }`}
                                                        >
                                                            <InboxStackIcon className="h-5 w-5 text-gray-500" /> Subscription
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={handleLogout}
                                                            className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''
                                                                }`}
                                                        >
                                                            <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />{' '}
                                                            Logout
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
                </nav>

                {/* Modal for Create Folder */}
                <Transition appear show={bucketModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={() => setBucketModalOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-30" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FolderPlusIcon className="h-6 w-6 text-blue-600" />
                                        Create Folder
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Folder Name</label>
                                            <input
                                                type="text"
                                                value={bucketName}
                                                onChange={(e) => setBucketName(e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter folder name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Type</label>
                                            <select
                                                value={bucketType}
                                                onChange={(e) => setBucketType(e.target.value as 'self' | 'group')}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="self">Self</option>
                                                <option value="group">Group</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end mt-6 space-x-3">
                                            <button
                                                onClick={() => setBucketModalOpen(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCreateFolder}
                                                disabled={loading}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                                            >
                                                {loading ? 'Creating...' : 'Create'}
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>

                {/* Page Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
                    ) : (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-xl">
                            <h1 className="text-4xl font-bold text-white mb-2">Welcome to SnapSync!</h1>
                            <p className="text-xl text-blue-100">
                                Hello, {(userData?.firstName || firstName) + ' ' + (userData?.lastName || lastName)}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
