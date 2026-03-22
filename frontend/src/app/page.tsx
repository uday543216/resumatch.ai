"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { Shield, Zap, TrendingUp, Check, ArrowLeft, AlertTriangle } from "lucide-react";

interface AnalysisResult {
  filename: string;
  score: number;
  roast: string;
  missing_keywords: string[];
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setResult(null);
    
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("http://localhost:8000/api/roast", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Failed to analyze resume");
      }
      
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 pb-20">
      {/* Navigation */}
      <nav className="w-full py-6 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-extrabold text-2xl tracking-tighter shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          Resu<span className="text-blue-600">Match</span> AI
        </div>
        {!result && (
          <div className="hidden md:flex gap-8 font-medium text-sm">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            <a href="#roast" className="hover:text-blue-600 transition">Free AI Roast</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-10 pb-16 text-center">
        {!result && (
          <>
            <div className="inline-block mb-4 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
              The #1 AI Job Search Advantage
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Beat the ATS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Get Hired Faster.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto font-light">
              Upload your resume, and our AI will brutally analyze it against your target job descriptions to ensure you pass keyword filters and secure the interview.
            </p>
          </
        )}
        
        {/* Upload Widget Area or Results */}
        <div id="roast" className={`max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative ${result ? 'p-8 md:p-12 text-left' : 'p-2 md:p-8'}`}>
          {!result && (
             <div className="absolute -top-4 -right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
               100% Free!
             </div>
          )}

          {isUploading && (
            <div className="py-20 text-center">
              <Zap className="w-16 h-16 text-blue-600 mx-auto animate-pulse mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Extracting Keywords & Analyzing...</h3>
              <p className="text-gray-500 text-base">Our AI recruiter is reading your timeline and generating a brutally honest roast.</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-8 overflow-hidden max-w-md mx-auto">
                <div className="bg-blue-600 h-2 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: "60%" }}></div>
              </div>
            </div>
          )}

          {!isUploading && !result && (
            <>
              <h2 className="text-2xl font-bold mb-2 text-center mt-4">Brutal AI Resume Roaster</h2>
              <p className="text-gray-500 mb-4 text-center text-sm">Find out exactly why you are getting rejected.</p>
              <FileUpload onUpload={handleUpload} />
            </>
          )}

          {result && (
            <div>
              <button 
                onClick={() => setResult(null)} 
                className="flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-6 transition"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Upload
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-6 mb-6">
                <div>
                  <h2 className="text-3xl font-extrabold mb-1">Your ATS Score</h2>
                  <p className="text-gray-500">File: {result.filename}</p>
                </div>
                <div className={`mt-4 md:mt-0 px-6 py-4 rounded-2xl font-black text-4xl shadow-sm border-2 flex items-center justify-center min-w-[120px] ${
                  result.score < 50 ? 'bg-red-50 text-red-600 border-red-200' :
                  result.score < 80 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                  'bg-green-50 text-green-600 border-green-200'
                }`}>
                  {result.score}/100
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold flex items-center mb-3">
                  <AlertTriangle className="mr-2 text-orange-500" /> AI Recruiter's Roast
                </h3>
                <div className="bg-gray-50 border-l-4 border-orange-500 p-5 rounded-r-xl">
                  <p className="text-gray-700 italic font-medium leading-relaxed">"{result.roast}"</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Red Flags & Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, i) => (
                    <span key={i} className="bg-red-50 border border-red-100 text-red-700 px-3 py-1.5 rounded-lg font-medium text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900 text-white rounded-2xl p-6 mt-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2">Want to fix this instantly?</h3>
                <p className="text-blue-100 mb-4 text-sm">Upgrade to Premium to let ResuMatch AI automatically rewrite your resume to pass the ATS for any specific Job Description.</p>
                <button className="bg-white text-blue-900 w-full py-3 rounded-xl font-bold hover:bg-blue-50 transition">
                  Unlock Premium for ₹299/mo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Features Grid */}
      {!result && (
        <section id="features" className="max-w-7xl mx-auto px-8 py-20 mt-10">
          <h2 className="text-3xl font-bold text-center mb-12">Why your current resume is failing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-red-500 shadow-sm mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Trapped in the ATS</h3>
              <p className="text-gray-600">75% of resumes are rejected by ATS bots before a human ever sees them because of missing keywords or formatting.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-purple-500 shadow-sm mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Generic & Boring</h3>
              <p className="text-gray-600">Recruiters spend 6 seconds per resume. If you aren't perfectly tailored to the job description, they move on.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-green-500 shadow-sm mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Low Impact Metrics</h3>
              <p className="text-gray-600">Listing duties instead of accomplishments. Our AI rewrites your bullets to highlight impact and results.</p>
            </div>
          </div>
        </section>
      )}

      {/* Pricing / Monetization */}
      {!result && (
        <section id="pricing" className="max-w-7xl mx-auto px-8 py-20 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Pricing that pays for itself</h2>
          <p className="text-xl text-gray-500 mb-12">Invest in your career. Get hired faster.</p>
          
          <div className="flex justify-center">
            <div className="bg-gray-900 text-white p-10 rounded-3xl max-w-sm w-full text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro Job Seeker</h3>
              <div className="mb-6">
                <span className="text-5xl font-extrabold">₹299</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <p className="text-gray-400 mb-8 border-b border-gray-800 pb-8">Everything you need to land your dream role.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" /> <span>Unlimited Resume Tailoring</span></li>
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" /> <span>AI Cover Letter Generator</span></li>
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" /> <span>Advanced ATS Keyword matching</span></li>
                <li className="flex gap-3"><Check className="text-blue-500 shrink-0" /> <span>PDF Downloads</span></li>
              </ul>
              
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition">
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
