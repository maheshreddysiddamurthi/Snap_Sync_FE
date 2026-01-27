'use client';

import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
    UserIcon,
    Cog6ToothIcon,
    InboxStackIcon,
    ArrowRightOnRectangleIcon,
    EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

export default function DashboardNav() {
    const { user, logout } = useAuth0();

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link
                        href="/dashboard"
                        className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition"
                    >
                        Dashboard
                    </Link>

                    {/* Profile Menu (three dots) - visible after login */}
                    {user && (
                        <Menu as="div" className="relative">
                            <Menu.Button
                                className="flex items-center justify-center h-10 w-10 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition cursor-pointer"
                                aria-label="Open account menu"
                                title="Account menu"
                            >
                                <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
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
                                                src={user.picture || '/default-avatar.png'}
                                                alt="User"
                                                width={48}
                                                height={48}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-sm font-semibold text-gray-900 truncate">
                                                    {user.name || 'User'}
                                                </span>
                                                <span className="block text-xs text-gray-500 truncate">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/profile"
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                                >
                                                    <UserIcon className="h-5 w-5 text-gray-500 shrink-0" /> Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/settings"
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                                >
                                                    <Cog6ToothIcon className="h-5 w-5 text-gray-500 shrink-0" /> Settings
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/dashboard/subscription"
                                                    className={`flex items-center gap-2 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                                >
                                                    <InboxStackIcon className="h-5 w-5 text-gray-500 shrink-0" /> Subscription
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 ${active ? 'bg-gray-100' : ''}`}
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500 shrink-0" /> Logout
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
    );
}
