import { Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';

interface DeleteDialogProps {
  title: string;
  message: string;
  onDelete: () => void;
  isDeleting?: boolean;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

export function DeleteDialog({
  title,
  message,
  onDelete,
  isLoading,
  isDeleting,
  trigger,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={isDeleting || isLoading}>
        {trigger ? (
          trigger
        ) : (
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
