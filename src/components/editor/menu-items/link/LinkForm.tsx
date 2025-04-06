
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

export interface LinkData {
  text?: string;
  link?: string;
}

const formSchema = z.object({
  text: z.string().optional(),
  link: z
    .string()
    .refine((value) => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
      message: 'Please enter a valid URL',
    }),
});

interface LinkFormProps {
  initialValue?: LinkData;
  onSubmit: (values: LinkData) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export default function LinkForm({ initialValue, onSubmit, onCancel, isEditMode = false }: LinkFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: initialValue?.text || '',
      link: initialValue?.link || '',
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  const hasSelectedText = !!initialValue?.text;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="font-medium mb-3">{isEditMode ? 'Edit link' : 'Create a link'}</h3>
        
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Link text" 
                  autoFocus={!hasSelectedText} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://example.com" 
                  autoFocus={hasSelectedText} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditMode ? 'Update' : 'Link'}</Button>
        </div>
      </form>
    </Form>
  );
}
