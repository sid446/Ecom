// components/admin/SeedCoupons.tsx
'use client'

import { useState } from 'react';

export default function SeedCoupons() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeedCoupons = async () => {
    setIsSeeding(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/seed-coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you set up ADMIN_SECRET_KEY
          // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to seed coupons',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seed Test Coupons</h2>
        <p className="text-gray-600 mb-6">
          This will create test coupons in your database for development and testing purposes.
        </p>

        <button
          onClick={handleSeedCoupons}
          disabled={isSeeding}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            isSeeding
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSeeding ? 'Seeding Coupons...' : 'Seed Test Coupons'}
        </button>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-medium mb-2 ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Success!' : 'Error'}
            </h3>
            <p className={result.success ? 'text-green-700' : 'text-red-700'}>
              {result.message}
            </p>

            {result.success && result.data && (
              <div className="mt-4">
                <p className="text-green-700 mb-2">
                  Created {result.data.created} coupons, removed {result.data.deleted} existing ones.
                </p>
                <div className="bg-white rounded border p-3 max-h-60 overflow-y-auto">
                  <h4 className="font-medium text-gray-800 mb-2">Created Coupons:</h4>
                  <ul className="space-y-1 text-sm">
                    {result.data.coupons.map((coupon: any) => (
                      <li key={coupon.code} className="flex justify-between items-center">
                        <span className="font-mono font-medium">{coupon.code}</span>
                        <span className="text-gray-600">{coupon.description}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-gray-800 mb-2">Test Coupons Info:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>WELCOME10:</strong> 10% off for first-time customers</li>
            <li><strong>NEWBIE50:</strong> ₹50 off for new customers (min ₹500 order)</li>
            <li><strong>SAVE20:</strong> 20% off on orders above ₹2000</li>
            <li><strong>FLAT200:</strong> ₹200 off on orders above ₹1500</li>
            <li><strong>MEGA30:</strong> 30% off on orders above ₹5000 (max ₹2000 discount)</li>
            <li><strong>EXPIRED10:</strong> Expired coupon for testing validation</li>
            <li><strong>INACTIVE15:</strong> Inactive coupon for testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}