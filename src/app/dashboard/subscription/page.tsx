'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function Subscription() {
    const subscriptionPlan = {
        name: 'Pro Plan',
        price: '₹499/month',
        features: [
            'Unlimited Buckets',
            'Priority Support',
            'Auto Sync',
            'Advanced Analytics',
        ],
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Subscription</h1>

                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{subscriptionPlan.name}</h2>
                        <p className="text-gray-600 mb-6">{subscriptionPlan.price}</p>

                        <ul className="space-y-2 mb-6">
                            {subscriptionPlan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-indigo-600 rounded-full" />
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
                            Manage Subscription
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
