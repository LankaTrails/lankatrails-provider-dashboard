import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Star, Package, Plus } from "lucide-react";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import { deleteActivityService, fetchAllActivities } from "@/services/activityService";
import { useState,useEffect } from "react";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/components/forms/ConfirmDeleteModal"; // adjust path



const mockServices = {
  activity: [
    {
      id: 1,
      title: "Wildlife Safari - Yala",
      type: "Activity",
      category: "activity",
      price: "$120/person",
      bookings: "15 this month",
      rating: 4.8,
      status: "active",
    },
    {
      id: 2,
      title: "Hiking - Ella",
      type: "Activity",
      category: "activity",
      price: "$80/person",
      bookings: "10 this month",
      rating: 4.5,
      status: "inactive",
    },
  ],
  transportation: [
    {
      id: 3,
      title: "Airport Pickup",
      type: "Transport",
      category: "transportation",
      price: "$50",
      bookings: "20 this month",
      rating: 4.9,
      status: "active",
    },
  ],
  "tour-guides": [
    {
      id: 4,
      title: "City Tour Guide - Colombo",
      type: "Tour Guide",
      category: "tour-guides",
      price: "$100/day",
      bookings: "5 this month",
      rating: 4.7,
      status: "active",
    },
  ],
};

// Helper to prettify the serviceType
const formatServiceTitle = (type?: string) => {
  if (!type) return "Service";
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

type Activity = {
  serviceId: number;
  serviceName?: string;
  status: boolean;
  // add other properties if needed
};


const ServiceListPage = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [fetchedActivities, setFetchedActivities] = useState<Activity[]>([]);
  const services =
  serviceType === "activity"
    ? fetchedActivities.map((item, index) => ({
        id: item.serviceId, // fallback since serviceId is null
        title: item.serviceName ?? "Untitled Activity",
        type: "Activity",
        category: "activity",
        bookings: "N/A",
        rating: 2,
        status: item.status ? "active" : "inactive",
      }))
    : mockServices[serviceType as keyof typeof mockServices] || [];

  const title = formatServiceTitle(serviceType);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
//handle delete click
const handleDeleteClick = (id:number)=>{
  setSelectedServiceId(id);
  setDeleteModalOpen(true);
}
//doing the backend process for deletion
const confirmDelete = () => {
  if (selectedServiceId != null) {
    
    console.log("Deleting service:", selectedServiceId);
    // Call delete API here
    const deleteService = async () => {
      const result = await deleteActivityService(selectedServiceId);
      console.log("Delete result:", result);
    };
    deleteService()
      .then(() => {
        console.log("Service deleted successfully");
        // Optionally, refresh the service list or show a success message
        setFetchedActivities((prev) => prev.filter((service) => service.status == true));
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        // Optionally, show an error message
      });

    setDeleteModalOpen(false);
  }
};


  //get all activities to display on the cards
  useEffect(() => {
  const loadActivities = async () => {
    const result = await fetchAllActivities(0, 3);
    console.log("Fetched activities", result);
    setFetchedActivities(result.content);
  };

  loadActivities();
}, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl p-2 font-bold">{title} Services</h1>
        <ProviderTopBar />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length > 0 ? (
                services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {/* <Badge variant="outline">{service.type}</Badge> */}
                      <Badge variant={service.status? 'default' : 'secondary'}>
                        {service.status}
                      </Badge>
                        <Trash2
    className="w-4 h-4 text-red-500 cursor-pointer ml-2 hover:scale-110 transition-transform"
    onClick={() => handleDeleteClick(service.id)}
    // title="Delete Service"
  />
                    </div>
                    <CardTitle className="text-lg">
                      {service.title}
                    
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {/* <span className="text-sm text-gray-600">Price:</span> */}
                        {/* <span className="font-semibold text-primary-500">{service.price}</span> */}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Bookings:</span>
                        <span className="font-medium">{service.bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium ml-1">{service.rating}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/provider/${serviceType}/${service.id}`)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/provider/${serviceType}/edit/${service.id}`)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center space-y-4 py-12 bg-white border-2 border-dashed border-gray-200 rounded-lg shadow-sm">
                  <Package className="w-12 h-12 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-700">No services in this category</h3>
                  <p className="text-sm text-gray-500">Click below to add your first service.</p>
                  <Button onClick={() => navigate(`/provider/${serviceType}/add`)} className="bg-primary-500 hover:bg-primary-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </div>
              )}
      </div>
      <ConfirmDeleteModal
  isOpen={isDeleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={confirmDelete}
/>
    </div>
  );
};

export default ServiceListPage;
