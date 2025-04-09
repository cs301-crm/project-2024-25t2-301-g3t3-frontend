import { useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useClient } from "@/contexts/client-context";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const DeleteClientButton = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const { client, deleteClient } = useClient(); 
  const router = useRouter();

  const handleDeleteClient = async () => {
    if(!client){return};
    setDeleting(true);
    try {
      await deleteClient();
      toast({
        title: "Client deleted",
        description: `Client ${client.firstName} ${client.lastName} has been deleted successfully.`,
      });
      setOpen(false);
      router.push(`/client`); 
    } catch (err) {
      toast({
        title: "Unable to delete Client",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-500 hover:text-red cursor-pointer"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Client Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the client <strong>{client?.firstName} {client?.lastName}</strong>. <br />
            This action <strong>cannot be undone</strong>. To confirm, type <strong>&quot;delete&quot;</strong> below.
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
            onClick={handleDeleteClient}
            disabled={inputValue !== "delete" || deleting}
          >
            {deleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteClientButton;
