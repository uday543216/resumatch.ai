"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
            <h1 className="text-5xl font-extrabold mb-4 text-gray-900">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Welcome to ResuMatch AI Premium. Your career is about to take off.
            </p>
            {sessionId && (
               <div className="bg-gray-50 text-gray-500 text-sm p-4 rounded-lg mb-8 font-mono overflow-x-auto max-w-full">
                 Session ID: {sessionId}
               </div>
            )}
            <Link href="/" className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition">
                Start Tailoring Resumes
            </Link>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
