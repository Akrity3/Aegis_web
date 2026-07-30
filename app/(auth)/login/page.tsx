"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginForm from "@/app/(auth)/_components/LoginForm";

export default function LoginPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasValidGoogleClientId =
    !!googleClientId && googleClientId.includes(".apps.googleusercontent.com");

  // If Google Client ID is not configured, render login form without Google OAuth
  if (!hasValidGoogleClientId) {
    return <LoginForm showGoogleButton={false} />;
  }
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginForm showGoogleButton={true} />
    </GoogleOAuthProvider>
  );
}
