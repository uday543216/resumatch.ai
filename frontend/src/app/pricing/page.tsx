"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    success_url: "http://localhost:3000/success",
                    cancel_url: "http://localhost:3000/pricing"
                })
            });
            const data = await res.json();
            if (data.url) {
                // Redirects to Stripe hosted checkout page
                window.location.href = data.url;
            } else {
                alert(data.detail || "Failed to create checkout session");
            }
        } catch (e) {
            console.error(e);
            alert("Checkout Error. Is the FastAPI backend running on port 8000?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <h1 className="text-5xl font-extrabold mb-4 text-gray-900 text-center">Upgrade to Premium</h1>
            <p className="text-xl text-gray-500 mb-12 text-center max-w-lg">Stop getting auto-rejected by ATS bots. Invest in your career and start getting interviews.</p>
            
            <div className="bg-white p-10 rounded-3xl max-w-sm w-full shadow-2xl relative border border-gray-100">
                <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-4 py-1 text-white rounded-bl-xl uppercase tracking-wider">
                  Pro Job Seeker
                </div>
                <div className="mb-6">
                  <span className="text-6xl font-extrabold text-gray-900">₹299</span>
                  <span className="text-gray-500 font-medium">/mo</span>
                </div>
                <p className="text-gray-500 mb-8 border-b border-gray-100 pb-8 leading-relaxed">Full access to our AI rewriting and ATS matching tools.</p>
                
                <ul className="space-y-4 mb-10 text-gray-700 font-medium">
                  <li className="flex gap-3 items-center"><Check className="text-blue-500 shrink-0" /> Unlimited AI resume tailoring</li>
                  <li className="flex gap-3 items-center"><Check className="text-blue-500 shrink-0" /> Custom Cover Letter Generator</li>
                  <li className="flex gap-3 items-center"><Check className="text-blue-500 shrink-0" /> ATS Keyword Gap Analysis</li>
                  <li className="flex gap-3 items-center"><Check className="text-blue-500 shrink-0" /> Export to clean PDF templates</li>
                </ul>
                
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-gray-900 text-white hover:bg-black py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Creating Session...</span>
                  ) : (
                    <>
                      <span>Pay Securely</span>
                      <span className="opacity-50 text-sm ml-2 font-normal">via Stripe</span>
                    </>
                  )}
                </button>
                
                <div className="mt-6 text-center">
                   <Link href="/" className="text-sm text-gray-400 hover:text-blue-600 font-medium hover:underline transition">
                     ← Return to Free Trial
                   </Link>
                </div>
            </div>
            
            <div className="max-w-lg mt-12 text-center text-xs text-gray-400">
                Payments are securely processed by Stripe. Cancel anytime. 100% money-back guarantee within the first 7 days if you don't get an interview.
            </div>
        </div>
    );
}
