"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ClientNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8 text-center">
      <div className="bg-slate-100 p-6 rounded-full">
        <Users className="h-12 w-12 text-slate-400" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Client Not Found</h1>
        <p className="text-slate-500 max-w-md">
          We couldn&apos;t find the client you&apos;re looking for. It may have been removed or you might have followed an incorrect link.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        
        <Link href="/client">
          <Button>
            Browse All Clients
          </Button>
        </Link>
      </div>
    </div>
  );
}