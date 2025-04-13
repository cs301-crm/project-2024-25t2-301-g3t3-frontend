'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (mounted && !loading && (!user || !user.userId )) {
      localStorage.removeItem("userEmail");
      router.push('/login');
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading || !user || !user.userId) return (
    <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  )

  return <>{children}</>;
}
