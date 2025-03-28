import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useClient } from "@/contexts/client-context";
import { handleApiError } from "@/lib/api";
import { Trash2 } from "lucide-react";

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
        title: "Account deleted",
        description: `Account for ${clientName} has been deleted successfully.`,
      });
      setOpen(false);
      onSuccess?.(); // Call the success callback
    } catch (err) {
      handleApiError(err);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
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
        <Button variant="ghost" size="icon" className="h-7 w-7" disabled={deleting}> 
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Account Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete account for {clientName}.
            This action is irreversible. To confirm, type <strong>&quot;delete&quot;</strong> below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type 'delete' to confirm"
          className="mt-2"
        />
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={inputValue !== "delete" || deleting}
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountButton;