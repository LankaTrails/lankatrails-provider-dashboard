import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';

const sections: { key: keyof any; title: string }[] = [
  { key: 'whatsIncluded', title: "What's included" },
  { key: 'whatToExpect', title: 'What to expect' },
  { key: 'departureAndReturn', title: 'Departure and return' },
  { key: 'accessibility', title: 'Accessibility' },
  { key: 'additionalInformation', title: 'Additional information' },
  { key: 'cancellationPolicy', title: 'Cancellation policy' },
];

const ServiceView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const service = useMemo(() => {
    const stored = localStorage.getItem(`service_${id}`);
    return stored ? JSON.parse(stored) : null;
  }, [id]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-gray-500">Service not found.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-600 hover:text-primary-600">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <Card>
          <CardHeader>
            <CardTitle>{service.title}</CardTitle>
            <p className="text-sm text-gray-500 capitalize">{service.category}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-700 whitespace-pre-line mt-1">{service.description}</p>
            </div>
            <div>
              <h4 className="font-medium">Price</h4>
              <p className="text-gray-700 mt-1">{service.price}</p>
            </div>

            {/* Optional Sections */}
            <Accordion type="multiple" className="w-full">
              {sections.map((s) => (
                service[s.key] ? (
                  <AccordionItem key={s.key} value={s.key as string}>
                    <AccordionTrigger>{s.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="whitespace-pre-line text-gray-700">{service[s.key]}</p>
                    </AccordionContent>
                  </AccordionItem>
                ) : null
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceView;
