"use client";

import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from 'next/link';

interface UserDetails {
    role?: string;
    permissions?: string[];
    picture?: string;
    name?: string;
    email?: string;
    emailVerified?: boolean;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
}

export default function ProfilePage() {
    const { user, getAccessTokenSilently } = useAuth0();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<UserDetails | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [countryCode, setCountryCode] = useState('+91');

    const countryCodes = [
        { code: "+1", name: "United States" },
        { code: "+91", name: "India" },
        { code: "+44", name: "United Kingdom" },
        { code: "+61", name: "Australia" },
        { code: "+81", name: "Japan" },
        { code: "+49", name: "Germany" },
        { code: "+33", name: "France" },
        { code: "+86", name: "China" },
        { code: "+7", name: "Russia" },
        { code: "+39", name: "Italy" },
        { code: "+34", name: "Spain" },
        { code: "+55", name: "Brazil" },
        { code: "+27", name: "South Africa" },
        { code: "+82", name: "South Korea" },
        { code: "+966", name: "Saudi Arabia" },
        { code: "+971", name: "United Arab Emirates" },
        { code: "+880", name: "Bangladesh" },
        { code: "+92", name: "Pakistan" },
        { code: "+20", name: "Egypt" },
        { code: "+62", name: "Indonesia" },
        // ... (add more as needed, or use a full list from a package)
    ];

    // Fetch profile info from backend
    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/sync`, {
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
                        mobileNumber: user.mobileNumber,
                        picture: user.picture,
                        email_verified: user.email_verified,
                        updated_at: user.updated_at,
                    }
                }),
                credentials: 'include',
            });
            const data = await res.json();
            setProfile(data.user);
            setFirstName(data.user.firstName || '');
            setLastName(data.user.lastName || '');
            setMobileNumber(data.user.mobileNumber || user?.mobileNumber || '');
            setSelectedImage(data.user.picture || user?.picture || null);
        } catch {
            setMessage('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [user, getAccessTokenSilently]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add this function inside your ProfilePage component
    const saveMobileNumberToBackend = async () => {
        if (!user) return;
        setLoading(true);
        setMessage('');
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/mobile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobileNumber, // Only send the number, not auth0Id
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Mobile number updated!');
                setProfile((prev) => prev ? { ...prev, mobileNumber } : prev);
            } else {
                setMessage(data.error || 'Failed to update mobile number');
            }
        } catch {
            setMessage('Failed to update mobile number');
        } finally {
            setLoading(false);
        }
    };

    // Save profile changes
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setMessage('');
        let pictureToSend = selectedImage || user.picture;
        try {
            if (imageFile && selectedImage) {
                pictureToSend = selectedImage;
            }
            const token = await getAccessTokenSilently();
            // Save profile (name, picture, etc.)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        sub: user.sub,
                        email: user.email,
                        mobileNumber, // still send to sync for backward compatibility
                        picture: pictureToSend,
                        firstName,
                        lastName,
                    }
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                // Save mobile number to /api/profile/mobile as well
                const mobileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/mobile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mobileNumber,
                    }),
                    credentials: 'include',
                });
                const mobileData = await mobileRes.json();
                if (mobileRes.ok) {
                    setMessage('Profile and mobile number updated!');
                    setProfile({ ...data.user, mobileNumber });
                } else {
                    setMessage(mobileData.error || 'Profile updated, but failed to update mobile number');
                    setProfile(data.user);
                }
                setSelectedImage(data.user.picture);
                setImageFile(null);
            } else {
                setMessage(data.error || 'Failed to update profile');
            }
        } catch {
            setMessage('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="max-w-xl mx-auto py-10">
                <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex items-center mb-6">
                        <Image
                            src={selectedImage || profile?.picture || user?.picture || 'https://via.placeholder.com/64'}
                            alt="Profile"
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                            width={64}
                            height={64}
                        />
                        <div>
                            <div className="text-lg font-semibold">{profile?.email || user?.email}</div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo</label>
                        <input
                            type="file"
                            id="profilePhoto"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={loading}
                            className="mt-1 block w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div className="flex">
                            <select
                                className="rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm py-2 h-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                value={countryCode}
                                onChange={e => setCountryCode(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '140px', maxWidth: '180px' }}
                            >
                                {countryCodes.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name} ({c.code})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                id="mobileNumber"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 sm:text-sm flex-1"
                                value={mobileNumber}
                                onChange={e => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setMobileNumber(value);
                                }}
                                disabled={loading}
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                placeholder="Enter 10-digit number"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Select your country and enter a 10-digit mobile number.</p>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                            value={profile?.email || user?.email || ''}
                            disabled
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                    {message && <div className="text-green-600 mt-2">{message}</div>}
                </form>
            </div>
        </ProtectedRoute>
    );
} 