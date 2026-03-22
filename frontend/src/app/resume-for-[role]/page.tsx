import Link from "next/link";
import { TrendingUp, FileText, CheckCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const resolvedParams = await params;
  const roleRaw = resolvedParams?.role || "job-seeker";
  const roleName = roleRaw.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `Best ATS Resume Builder for ${roleName} - ResuMatch AI`,
    description: `Build a ${roleName} resume that passes ATS software and lands you interviews instantly.`,
  };
}

export default async function ProgrammaticSEOLanding({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const resolvedParams = await params;
  const roleRaw = resolvedParams?.role || "job-seeker";
  const roleName = roleRaw.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12">
      <nav className="w-full px-8 pb-12 flex justify-between items-center max-w-7xl mx-auto border-b border-gray-200">
        <Link href="/" className="font-extrabold text-2xl tracking-tighter shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          Resu<span className="text-blue-600">Match</span> AI
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
        <div className="inline-block mb-6 px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-bold uppercase tracking-wider">
          Tailored specifically for {roleName}s
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          The Only Resume Builder a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {roleName}
          </span> Needs.
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl px-4">
          ATS systems are ruthlessly rejecting {roleName} candidates who don't have the exact right keywords. Stop guessing. Our AI reads your target job descriptions and optimizing your specific experience.
        </p>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full mb-16">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">Key {roleName} Resumes Skills We Optimize:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
             {[1,2,3,4,5,6].map((idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                  <span className="text-gray-700 font-medium">Domain Specific Keyword Matcher {idx}</span>
                </div>
             ))}
          </div>
        </div>

        <Link href="/" className="bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-blue-700 transition shadow-xl hover:shadow-2xl flex items-center gap-2">
          <FileText size={24} /> Start Building My {roleName} Resume
        </Link>
      </main>
    </div>
  );
}
