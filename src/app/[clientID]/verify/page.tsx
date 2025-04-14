"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CheckCircle, FileIcon, X } from "lucide-react";
import { getS3PresignedURL } from "@/lib/api/s3Service";
import clientService from "@/lib/api/clientService";
import { Branding } from "@/components/branding";
import { toast } from "@/components/ui/use-toast";

export default function VerifyPage() {
  const params = useParams();
  const clientID = params.clientID as string;

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    // Reset verification state when file changes
    setVerificationComplete(false);
  };

  const handleVerify = async () => {
    if (!file) return;

    setIsVerifying(true);

    try {
        // console.log(file.name);
        const uploadDocumentURL = await getS3PresignedURL(file.name);
        // console.log(uploadDocumentURL);
        const headers: HeadersInit = {
            'Content-Type': file.type
        };
        const uploadDocumentResponse = await fetch(uploadDocumentURL, {
            method: 'PUT',
            headers: headers,
            body: file,
        });        
        if (!uploadDocumentResponse.ok) {
            throw new Error('Failed to upload file to S3');
        }
        const verifyUploadResponse = await clientService.verifyUpload(clientID);
        console.log(verifyUploadResponse);
      // Simulate verification process
    //   await new Promise((resolve) => setTimeout(resolve, 2000));


      // In a real app, you would send the file to your API for verification
      // const formData = new FormData()
      // formData.append('file', file)
      // formData.append('clientID', clientID)
      // const response = await fetch('/api/verify', {
      //   method: 'POST',
      //   body: formData
      // })

      setVerificationComplete(true);
    } catch (error) {
      toast({
        title: "Error",
        description: `Unable to upload document`,
      });
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
    
        <div className="max-w-2xl mx-auto flex py-10 justify-center">
          <Branding size="md" className="w-full" showTagline={false} layout="horizontal" />
        </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Document Verification</CardTitle>
          <CardDescription>
            Upload a document to verify your account for client ID:{" "}
            <span className="font-medium">{clientID}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!verificationComplete && (
            <>
              <Alert className="bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700 text-sm">
                  Please upload a clear, legible copy of your identification
                  document. We accept PDF, JPG, or PNG files.
                </AlertDescription>
              </Alert>

              <FileUploader
                onFileChange={handleFileChange}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />

              {file && (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-slate-50">
                  <FileIcon className="h-5 w-5 text-slate-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileChange(null)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )}
            </>
          )}

          {verificationComplete && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 text-sm">
                Document verification has been submitted successfully. We will
                review your document shortly.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!verificationComplete && (
            <Button
              onClick={handleVerify}
              disabled={
                !file || isUploading || isVerifying || verificationComplete
              }
            >
              {isVerifying ? "Verifying..." : "Verify Document"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}