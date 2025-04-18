"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPageClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return "Access was denied. This could be because you denied permission or there was an issue with your Google account settings.";
      case "Configuration":
        return "There is a problem with the server configuration. Please try again later.";
      case "Verification":
        return "Email verification is required. Please check your email for a verification link.";
      default:
        return "An unknown error occurred. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Authentication Error</h1>
        <div className="border-t border-b py-4 my-4">
          <p className="text-lg mb-2">Error: {error || "Unknown"}</p>
          <p className="text-gray-600">{getErrorMessage()}</p>
        </div>
        <div className="mt-6">
          <Link href="/sign-in">
            <Button className="w-full">Return to Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
