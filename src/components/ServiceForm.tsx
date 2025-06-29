import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = ['Accommodation', 'Food', 'Transport', 'Guide', 'Activity'] as const;

const baseSchema = z.object({
  title: z.string().min(3),
  category: z.enum(categories),
  price: z.string(),
  description: z.string().min(10),
  media: z.any().optional(),
});

const ServiceForm = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: { category: 'Accommodation' },
  });

  const onSubmit = (values: z.infer<typeof baseSchema>) => {
    setLoading(true);
    setTimeout(() => {
      console.log(values);
      setLoading(false);
      onOpenChange(false);
    }, 800);
  };

  const category = form.watch('category');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(v) => form.setValue('category', v as any)}
              value={form.watch('category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialized fields */}
          {category === 'Accommodation' && (
            <div className="space-y-2">
              <Label>Number of Rooms</Label>
              <Input type="number" placeholder="e.g. 5" />
              <Label>Seasonal Pricing</Label>
              <Input placeholder="e.g. Peak 120, Off 80" />
            </div>
          )}
          {category === 'Food' && (
            <div className="space-y-2">
              <Label>Menu Highlights</Label>
              <Textarea placeholder="Add signature dishes..." />
              <Label>Dining Options</Label>
              <Input placeholder="Dine-in / Takeout" />
            </div>
          )}
          {category === 'Transport' && (
            <div className="space-y-2">
              <Label>Vehicle Type</Label>
              <Input placeholder="e.g. Van, Car" />
              <Label>Rate Model</Label>
              <Input placeholder="Per km / Per day" />
            </div>
          )}
          {category === 'Guide' && (
            <div className="space-y-2">
              <Label>Available Zones</Label>
              <Input placeholder="e.g. Cultural Triangle" />
              <Label>Customizable Tours?</Label>
              <Input placeholder="Yes / No" />
            </div>
          )}
          {category === 'Activity' && (
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Input placeholder="Easy / Moderate / Hard" />
              <Label>Gear Provided</Label>
              <Input placeholder="e.g. Helmet, Harness" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="price">Pricing</Label>
            <Input id="price" {...form.register('price')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} {...form.register('description')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media">Media Upload</Label>
            <Input id="media" type="file" multiple {...form.register('media')} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
