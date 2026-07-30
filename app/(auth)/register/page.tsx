"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import RegisterForm from "@/app/(auth)/_components/RegisterForm";

export default function RegisterPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const hasValidGoogleClientId =
    !!googleClientId && googleClientId.includes(".apps.googleusercontent.com");

  if (!hasValidGoogleClientId) {
    return <RegisterForm showGoogleButton={false} />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <RegisterForm showGoogleButton={true} />
    </GoogleOAuthProvider>
  );
}
