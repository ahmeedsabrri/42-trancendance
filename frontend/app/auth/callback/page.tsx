'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthActions } from "../utils";




export default function CallbackPage() {
const router = useRouter();
const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { Oauth42 } = AuthActions();
  const searchParams = useSearchParams();
  useEffect(() => {
    const code = searchParams.get('code');
    const handleCallback = () => {
      console.log("Code: ", code);
      Oauth42(code as string)
        .then((res) => {
          console.log(res.data.message);
          console.log("Logged in successfully");
          router.push('/dashboard');
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            const errorData = error.response.data;
            if (errorData.otp_code) {
              redirect(`/auth?otp_code=requried`); 
            } else {
              setError("An error occurred");
              setIsLoading(false);
            }
          }
        });
      }
      if (code) {
        handleCallback();
      }
    }, [searchParams, Oauth42, router]);
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try logging in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      {isLoading ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <h2 className="text-xl text-white font-semibold text-primary">
            Authenticating with 42...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we complete your authentication
          </p>
        </>
      ) : (
        <p className="text-muted-foreground">
          Redirecting to dashboard...
        </p>
      )}
    </div>
  );
}