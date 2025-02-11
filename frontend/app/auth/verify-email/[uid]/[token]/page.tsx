'use client'; // Mark this as a Client Component
import React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/auth/utils';


export default function VerifyEmail({
    params,
}: {
    params: Promise<{ uid: string; token: string }>;
}) {

    const { uid, token } = React.use(params);

    const [message, setMessage] = useState<string>('Verifying your email...');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.post('/auth/verify-email/', {
                    uid,
                    token,
                });

                router.push('/auth');
                setMessage(response.data.message);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message || 'An error occurred during verification.');
                } else {
                    setError('An unknown error occurred during verification.');
                }
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        if (uid && token) {
            verifyEmail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid, token]);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 w-full h-screen">
            <h1 className="text-2xl font-bold mb-4 text-white/70">Email Verification</h1>
            {isLoading ? (
                <p className="text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p className="text-green-600">{message}</p>
            )}
        </div>
    );
}