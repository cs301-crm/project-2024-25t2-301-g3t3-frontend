"use client";

import { useState } from "react";
import { CheckCircle, Clock, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClient } from "@/contexts/client-context";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";


interface VerifyClientButtonProps {
  clientId: string;
  verificationStatus?: string;
  verificationDocumentUploaded?: boolean;
}

export function VerifyClientButton({
  clientId,
  verificationStatus,
  verificationDocumentUploaded,
}: VerifyClientButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyClient } = useClient();
    
  const handleVerify = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await verifyClient(clientId);
      setIsOpen(false);
      toast({
        title: "Verify Success",
        description: "Client has been Verified successfully",
      });
    } catch (err) {
      console.error("Verification failed:", err);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationStatus === "VERIFIED") return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="cursor-pointer gap-2" 
          size="sm" 
          variant={verificationDocumentUploaded ? "default" : "outline"}
        >
          <FileText className="h-4 w-4" />
          Verify Client
          {verificationDocumentUploaded && (
            <Badge variant="secondary" className="ml-1">
              Ready
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            Client Verification
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3">
            {verificationDocumentUploaded ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {verificationDocumentUploaded 
                  ? "Verification document uploaded" 
                  : "Pending document upload"}
              </p>
              <p className="text-sm text-muted-foreground">
                {verificationDocumentUploaded
                  ? "All required documents have been submitted for verification."
                  : "Client needs to upload required documents before verification."}
              </p>
            </div>
          </div>


          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="mx-1 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsOpen(false);
              setError(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={!verificationDocumentUploaded || isLoading}
            onClick={handleVerify}
          >
            {isLoading ? "Verifying..." : "Verify Client"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}