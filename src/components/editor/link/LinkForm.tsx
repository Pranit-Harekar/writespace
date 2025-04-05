import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent } from 'react';

const formSchema = z.object({
  link: z
    .string()
    .refine((value) => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
      message: 'Please enter a valid URL',
    }),
});

interface LinkFormProps {
  initialValue?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export default function LinkForm({ initialValue, onSubmit, onCancel }: LinkFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: initialValue,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.link);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="font-medium mb-3">Create a link</h3>
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="https://google.com" autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Link</Button>
        </div>
      </form>
    </Form>
  );
}
