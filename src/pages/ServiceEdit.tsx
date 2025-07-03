import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// Categories supported by the system. Please keep in sync with ServiceForm.
const categories = ['Accommodation', 'Food', 'Transport', 'Guide', 'Activity'] as const;

// Common base schema. Category-specific fields are added dynamically below.
const baseSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  category: z.enum(categories),
  price: z.string(),
  description: z.string().min(10),
  whatsIncluded: z.string().optional(),
  whatToExpect: z.string().optional(),
  departureAndReturn: z.string().optional(),
  accessibility: z.string().optional(),
  additionalInformation: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

// A helper that returns additional schema fields depending on the category.
const getCategorySchema = (cat: typeof categories[number]) => {
  switch (cat) {
    case 'Accommodation':
      return z.object({ rooms: z.string(), seasonalPricing: z.string() });
    case 'Food':
      return z.object({ menuHighlights: z.string(), diningOptions: z.string() });
    case 'Transport':
      return z.object({ vehicleType: z.string(), rateModel: z.string() });
    case 'Guide':
      return z.object({ availableZones: z.string(), customizableTours: z.string() });
    case 'Activity':
      return z.object({ difficultyLevel: z.string(), gearProvided: z.string() });
    default:
      return z.object({});
  }
};

type BaseValues = z.infer<typeof baseSchema> & Record<string, any>;

const ServiceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  /*
    TODO: Replace with real fetch – currently we just mock the response
    based on the id param. The object should come from your backend / react-query.
  */
  const mockService = useMemo(() => {
    const stored = localStorage.getItem(`service_${id}`);
    if (stored) return JSON.parse(stored);
    return {
      id,
      title: 'Sample Service',
      category: 'Transport',
      price: '$100',
      description: 'Sample description',
    };
  }, [id]);

  const [currentCategory, setCurrentCategory] = useState<typeof categories[number]>(mockService.category as any);
  const formSchema = useMemo(() => baseSchema.merge(getCategorySchema(currentCategory)), [currentCategory]);

  const form = useForm<BaseValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: mockService.title,
      category: currentCategory,
      price: mockService.price,
      description: mockService.description,
      whatsIncluded: '',
      whatToExpect: '',
      departureAndReturn: '',
      accessibility: '',
      additionalInformation: '',
      cancellationPolicy: '',
    } as any,
  });

  const onSubmit = (values: BaseValues) => {
    console.log('Save service', values);
    localStorage.setItem(`service_${id}`,(JSON.stringify({ id, ...values })));
    navigate(`/services/${id}`);
  };

  const category = form.watch('category');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <Header />
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-600 hover:text-primary-600">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Service – {mockService.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register('title')} />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCurrentCategory(v as any);
                    form.setValue('category', v as any);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category-specific fields */}
              {category === 'Accommodation' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Number of Rooms</Label>
                    <Input {...form.register('rooms')} placeholder="e.g. 5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Seasonal Pricing</Label>
                    <Input {...form.register('seasonalPricing')} placeholder="Peak 120 / Off 80" />
                  </div>
                </div>
              )}

              {category === 'Food' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Menu Highlights</Label>
                    <Textarea {...form.register('menuHighlights')} placeholder="Signature dishes..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Dining Options</Label>
                    <Input {...form.register('diningOptions')} placeholder="Dine-in / Takeaway" />
                  </div>
                </div>
              )}

              {category === 'Transport' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Input {...form.register('vehicleType')} placeholder="Van, Car" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rate Model</Label>
                    <Input {...form.register('rateModel')} placeholder="Per km / Per day" />
                  </div>
                </div>
              )}

              {category === 'Guide' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Available Zones</Label>
                    <Input {...form.register('availableZones')} placeholder="Cultural Triangle" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customizable Tours?</Label>
                    <Input {...form.register('customizableTours')} placeholder="Yes / No" />
                  </div>
                </div>
              )}

              {category === 'Activity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Input {...form.register('difficultyLevel')} placeholder="Easy / Moderate" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gear Provided</Label>
                    <Input {...form.register('gearProvided')} placeholder="Helmet, Harness" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Price</Label>
                <Input {...form.register('price')} placeholder="$100" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={4} {...form.register('description')} />
              </div>

              {/* Additional Details */}
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="whatsIncluded">
                  <AccordionTrigger>What's included</AccordionTrigger>
                  <AccordionContent>
                    <Textarea rows={4} {...form.register('whatsIncluded')} placeholder="List what the service includes..." />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="whatToExpect">
                  <AccordionTrigger>What to expect</AccordionTrigger>
                  <AccordionContent>
                    <Textarea rows={4} {...form.register('whatToExpect')} placeholder="Describe what guests can expect..." />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="departureAndReturn">
                  <AccordionTrigger>Departure and return</AccordionTrigger>
                  <AccordionContent>
                    <Textarea rows={4} {...form.register('departureAndReturn')} placeholder="Provide departure and return details..." />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="accessibility">
                  <AccordionTrigger>Accessibility</AccordionTrigger>
                  <AccordionContent>
                    <Textarea rows={4} {...form.register('accessibility')} placeholder="Accessibility information..." />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="additionalInformation">
                  <AccordionTrigger>Additional information</AccordionTrigger>
                  <AccordionContent>
                    <Textarea rows={4} {...form.register('additionalInformation')} placeholder="Any other important details..." />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cancellationPolicy">
                  <AccordionTrigger>Cancellation policy</AccordionTrigger>
                  <AccordionContent>
                    <Textarea rows={4} {...form.register('cancellationPolicy')} placeholder="Describe cancellation rules..." />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="submit" className="w-full md:w-auto mt-4">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceEdit;
