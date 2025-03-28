"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export function PageNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-8 text-center">
      <div className="bg-amber-100 p-6 rounded-full">
        <AlertTriangle className="h-12 w-12 text-amber-600" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-slate-500 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Check the URL or try one of the links below.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <Link href="/dashboard">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}