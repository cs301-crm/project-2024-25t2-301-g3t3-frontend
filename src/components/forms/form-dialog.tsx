"use client";

import { ReactNode, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

interface FormDialogProps<T extends FieldValues> {
  title: string;
  description?: string;
  trigger: ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void> | void;
  loading?: boolean;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
  disableSubmit?: boolean;
}

export function FormDialog<T extends FieldValues>({
  title,
  description,
  trigger,
  form,
  onSubmit,
  loading = false,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  maxWidth = "500px",
  disableSubmit = false,
}: FormDialogProps<T>) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: T) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`max-h-[90vh] overflow-y-auto sm:max-w-[${maxWidth}]`}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">{description}</DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {children}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={loading || disableSubmit}>
                {loading ? "Processing..." : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
