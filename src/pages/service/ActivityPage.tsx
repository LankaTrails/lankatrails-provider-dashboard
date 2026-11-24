import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProviderTopBar from "@/components/provider/ProviderTopBar";

const services = [
  {
    id: 3,
    title: "Wildlife Safari - Yala",
    type: "Activity",
    category: "activity",
    price: "120/person",
    bookings: "15 this month",
    rating: 4.8,
    status: "active",
  },
];

const ActivityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">Activity Services</h1>
        <ProviderTopBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{service.type}</Badge>
                <Badge
                  variant={
                    service.status === "active" ? "default" : "secondary"
                  }
                >
                  {service.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bookings:</span>
                  <span className="font-medium">{service.bookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rating:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{service.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/services/${service.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;
