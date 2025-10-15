"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";

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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<UserDetails | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [countryCode, setCountryCode] = useState("+91");

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
    ];

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/profile/sync`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
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
                        },
                    }),
                    credentials: "include",
                }
            );
            const data = await res.json();
            setProfile(data.user);
            setFirstName(data.user.firstName || "");
            setLastName(data.user.lastName || "");
            setMobileNumber(data.user.mobileNumber || user?.mobileNumber || "");
            setSelectedImage(data.user.picture || user?.picture || null);
        } catch {
            setMessage("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [user, getAccessTokenSilently]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setMessage("");
        let pictureToSend = selectedImage || user.picture;
        try {
            if (imageFile && selectedImage) {
                pictureToSend = selectedImage;
            }
            const token = await getAccessTokenSilently();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/profile/sync`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user: {
                            sub: user.sub,
                            email: user.email,
                            mobileNumber,
                            picture: pictureToSend,
                            firstName,
                            lastName,
                        },
                    }),
                    credentials: "include",
                }
            );
            const data = await res.json();
            if (res.ok) {
                setMessage("Profile updated successfully!");
                setProfile({ ...data.user, mobileNumber });
                setSelectedImage(data.user.picture);
                setImageFile(null);
            } else {
                setMessage(data.error || "Failed to update profile");
            }
        } catch {
            setMessage("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="flex items-center gap-6 border-b pb-6 mb-6">
                        <Image
                            src={
                                selectedImage ||
                                profile?.picture ||
                                user?.picture ||
                                "https://via.placeholder.com/80"
                            }
                            alt="Profile"
                            className="rounded-full object-cover ring-4 ring-blue-200"
                            width={80}
                            height={80}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {profile?.firstName || user?.name || "Your Name"}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {profile?.email || user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Profile Photo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                                className="mt-2 block w-full text-sm text-gray-500 border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={loading}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={loading}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mobile Number
                            </label>
                            <div className="flex mt-2">
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    disabled={loading}
                                    className="rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    {countryCodes.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.name} ({c.code})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={mobileNumber}
                                    onChange={(e) =>
                                        setMobileNumber(
                                            e.target.value.replace(/\D/g, "").slice(0, 10)
                                        )
                                    }
                                    disabled={loading}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter 10-digit number"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile?.email || user?.email || ""}
                                disabled
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 text-white bg-blue-600 rounded-xl font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                        >
                            {loading ? "Saving..." : "Save Profile"}
                        </button>

                        {message && (
                            <div className="text-center text-green-600 font-medium">
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
