import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useClient } from "@/contexts/client-context";
import { handleApiError } from "@/lib/api";


interface DeleteAccountButtonProps {
  accountId: string;
  clientId: string;
  clientName: string;
  onSuccess?: () => void; 
  onError?: (error: unknown) => void; 
}

const DeleteAccountButton = ({ 
  accountId, 
  clientId, 
  clientName,
  onSuccess,
  onError 
}: DeleteAccountButtonProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { deleteAccount } = useClient();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccount(accountId, clientId);
      toast({
        title: "Account closed",
        description: `Account for ${clientName} has been closed successfully.`,
      });
      setOpen(false);
      onSuccess?.(); // Call the success callback
    } catch (err) {
      handleApiError(err);
      toast({
        title: "Error",
        description: "Failed to close account. Please try again.",
        variant: "destructive",
      });
      onError?.(err); // Call the error callback if provided
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        className="w-[120px] text-red-500 cursor-pointer"
        disabled={deleting}
      >
        Close
      </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Account Closure</AlertDialogTitle>
          <AlertDialogDescription>
            This will close account for {clientName}.
            To confirm, type <strong>&quot;close&quot;</strong> below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type 'close' to confirm"
          className="mt-2"
        />
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={inputValue !== "close" || deleting}
          >
            {deleting ? "Closing..." : "Confirm Close"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountButton;