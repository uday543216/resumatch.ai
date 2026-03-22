import "./globals.css";

export const metadata = {
  title: "ResuMatch AI - Pass the ATS",
  description: "AI ATS Resume Optimizer & Cover Letter Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
