'use client'; // Mark this as a Client Component
import React from 'react';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';


const api = axios.create({

    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
})


export default function VerifyEmail({
    params,
  }: {
    params: Promise<{ uid: string; token: string }>;
  }) {
    // Unwrap the params Promise using React.use()
    const { uid, token } = React.use(params);

    const [message, setMessage] = useState<string>('Verifying your email...');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                console.log('uid', uid);
                console.log('token', token);
                // Send a POST request to the backend to verify the email
                const response = await api.post('http://localhost:8000/api/auth/verify-email/', {
                    uid,
                    token,
                });

                window.location.href = '/auth'; // Redirect to the login page
                setMessage(response.data.message);
            } catch (err: any) {
                // Display the error message
                console.error(err.response?.data);
                setError(err.response?.data?.error || 'An error occurred during verification.');
            } finally {
                setIsLoading(false); // Stop loading
            }
        };

        if (uid && token) {
            verifyEmail();
        }
    }, [uid, token]);

    return (
            <div className="flex flex-col items-center justify-center space-y-4">
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