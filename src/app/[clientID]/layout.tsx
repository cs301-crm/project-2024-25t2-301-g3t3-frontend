// app/[clientID]/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
};

interface Props {
  children: ReactNode;
  params: Promise<{ clientID: string }>;
}

export default async function Layout({ children, params }: Props) {
  const resolvedParams = await params; // await it

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold">Client Portal</h1>
          <p className="text-sm text-slate-500">
            Client ID: {resolvedParams.clientID}
          </p>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
