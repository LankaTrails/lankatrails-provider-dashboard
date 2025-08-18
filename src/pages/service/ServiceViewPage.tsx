import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Edit, 
  MapPin, 
  Phone, 
  DollarSign, 
  Clock, 
  Users, 
  Star,
  Car,
  UtensilsCrossed,
  Bed,
  Mountain,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Languages,
  Navigation,
  Settings,
  Home,
  Coffee,
  Music,
  ParkingCircle,
  Dog,
  Dumbbell,
  Sparkles,
  Wifi,
  Utensils,
  Waves,
  TreePine,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { findServiceById } from "@/services/services";
import ProviderTopBar from "@/components/provider/ProviderTopBar";
import type {
  ActivityFormData,
  TransportFormData,
  AccommodationFormData,
  FoodBeverageFormData,
  TourGuideFormData,
  ImageData
} from "@/types/serviceTypes";

const providerTypeIcons = {
  'activity': Mountain,
  'tour-guides': Users,
  'transportation': Car,
  'food-beverage': UtensilsCrossed,
  'accommodation': Bed
};

const providerTypeColors = {
  'activity': 'bg-gradient-to-r from-green-500 to-emerald-600',
  'tour-guides': 'bg-gradient-to-r from-blue-500 to-indigo-600',
  'transportation': 'bg-gradient-to-r from-purple-500 to-violet-600',
  'food-beverage': 'bg-gradient-to-r from-orange-500 to-red-600',
  'accommodation': 'bg-gradient-to-r from-teal-500 to-cyan-600'
};

const ServiceViewPage = () => {
  const { id, serviceType } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: serviceData, isLoading, error } = useQuery({
    queryKey: ['service', serviceType, id],
    queryFn: () => findServiceById(serviceType!, Number(id)),
    enabled: !!(id && serviceType),
    staleTime: 5 * 60 * 1000,
  });

  const formatServiceTitle = (type?: string) => {
    if (!type) return "Service";
    return type
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const IconComponent = serviceType ? providerTypeIcons[serviceType as keyof typeof providerTypeIcons] : Mountain;
  const gradientClass = serviceType ? providerTypeColors[serviceType as keyof typeof providerTypeColors] : 'bg-gradient-to-r from-gray-500 to-gray-600';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Loading Service...</h1>
          <ProviderTopBar />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl p-2 font-bold">Service Not Found</h1>
          <ProviderTopBar />
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Service Not Found</h3>
            <p className="text-gray-500 mb-4">The requested service could not be found.</p>
            <Button onClick={() => navigate(`/provider/${serviceType}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/provider/${serviceType}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${gradientClass} text-white shadow-lg`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{serviceData.serviceName}</h1>
              <p className="text-gray-600">{formatServiceTitle(serviceType)} Service</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button 
              onClick={() => navigate(`/provider/${serviceType}/edit/${id}`)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Service</span>
            </Button>
          </div>
        </div>
        <ProviderTopBar />
      </div>

      {/* Service Status & Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center space-x-2">
                  {serviceData.status ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-red-600">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-xl font-bold text-blue-600">
                  LKR {serviceData.price?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{serviceData.priceType?.replace('_', ' ')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-medium">{serviceData.contactNo}</p>
              </div>
              <Phone className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(24)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="availability">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Location Information */}
            {serviceData.locations && serviceData.locations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span>Location</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceData.locations.map((location: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{location.formattedAddress}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                          <div>City: {location.city}</div>
                          <div>District: {location.district}</div>
                          <div>Province: {location.province}</div>
                          <div>Postal Code: {location.postalCode}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details">
            {/* Activity Details */}
            {serviceType === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mountain className="w-5 h-5 text-green-600" />
                    <span>Activity Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activity Type:</span>
                    <Badge variant="outline">{(serviceData as ActivityFormData).activityType?.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{(serviceData as ActivityFormData).duration || 'Not specified'}</span>
                  </div>
                  {(serviceData as ActivityFormData).activityDetails && (
                    <div>
                      <span className="text-gray-600 block mb-2">Description:</span>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg">{(serviceData as ActivityFormData).activityDetails}</p>
                    </div>
                  )}
                  {(serviceData as ActivityFormData).safetyInstructions && (
                    <div>
                      <span className="text-gray-600 block mb-2">Safety Instructions:</span>
                      <p className="text-sm bg-red-50 p-3 rounded-lg border border-red-200">{(serviceData as ActivityFormData).safetyInstructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transportation Details */}
            {serviceType === 'transportation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Car className="w-5 h-5 text-purple-600" />
                      <span>Vehicle Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Type:</span>
                      <Badge variant="outline">{(serviceData as TransportFormData).vehicleCategory?.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{(serviceData as TransportFormData).vehicleCapacity} passengers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{(serviceData as TransportFormData).vehicleQty} vehicles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Type:</span>
                      <Badge variant="secondary">{(serviceData as TransportFormData).fuelType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transmission:</span>
                      <Badge variant="secondary">{(serviceData as TransportFormData).transmissionType}</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <span>Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Air Conditioned:</span>
                      {(serviceData as TransportFormData).airConditioned ? 
                        <CheckCircle className="w-5 h-5 text-green-500" /> : 
                        <XCircle className="w-5 h-5 text-red-500" />
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Driver Included:</span>
                      {(serviceData as TransportFormData).driverIncluded ? 
                        <CheckCircle className="w-5 h-5 text-green-500" /> : 
                        <XCircle className="w-5 h-5 text-red-500" />
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Accommodation Details */}
            {serviceType === 'accommodation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Home className="w-5 h-5 text-teal-600" />
                      <span>Property Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge variant="outline">{(serviceData as AccommodationFormData).accommodationType?.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rooms:</span>
                      <span className="font-medium">{(serviceData as AccommodationFormData).numberOfRooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Guests:</span>
                      <span className="font-medium">{(serviceData as AccommodationFormData).maxGuests}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                      <span>Amenities</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'freeWifi', label: 'Free WiFi', icon: Wifi },
                      { key: 'parkingAvailable', label: 'Parking', icon: ParkingCircle },
                      { key: 'petFriendly', label: 'Pet Friendly', icon: Dog },
                      { key: 'breakfastIncluded', label: 'Breakfast', icon: Coffee },
                      { key: 'airConditioned', label: 'AC', icon: Settings },
                      { key: 'swimmingPool', label: 'Pool', icon: Waves },
                      { key: 'laundryService', label: 'Laundry', icon: Settings },
                      { key: 'roomService', label: 'Room Service', icon: Utensils },
                      { key: 'gymAccess', label: 'Gym', icon: Dumbbell },
                      { key: 'spaServices', label: 'Spa', icon: Sparkles }
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm ${(serviceData as AccommodationFormData)[key as keyof AccommodationFormData] ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                          {label}
                        </span>
                        {(serviceData as AccommodationFormData)[key as keyof AccommodationFormData] ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-gray-300" />
                        }
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Food & Beverage Details */}
            {serviceType === 'food-beverage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Utensils className="w-5 h-5 text-orange-600" />
                      <span>Restaurant Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <Badge variant="outline">{(serviceData as FoodBeverageFormData).foodAndBeverageType?.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuisine:</span>
                      <span className="font-medium">{(serviceData as FoodBeverageFormData).cuisineType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Open Hours:</span>
                      <span className="font-medium">{(serviceData as FoodBeverageFormData).openHours || 'Not specified'}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                      <span>Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'vegetarianOptions', label: 'Vegetarian', icon: TreePine },
                      { key: 'halalCertified', label: 'Halal', icon: Shield },
                      { key: 'alcoholServed', label: 'Alcohol', icon: Coffee },
                      { key: 'outdoorSeating', label: 'Outdoor', icon: TreePine },
                      { key: 'liveMusic', label: 'Live Music', icon: Music }
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className={`text-sm ${(serviceData as FoodBeverageFormData)[key as keyof FoodBeverageFormData] ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                          {label}
                        </span>
                        {(serviceData as FoodBeverageFormData)[key as keyof FoodBeverageFormData] ? 
                          <CheckCircle className="w-4 h-4 text-green-500" /> : 
                          <XCircle className="w-4 h-4 text-gray-300" />
                        }
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tour Guide Details */}
            {serviceType === 'tour-guides' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Guide Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guide Type:</span>
                      <Badge variant="outline">{(serviceData as TourGuideFormData).tourGuideType}</Badge>
                    </div>
                    {(serviceData as TourGuideFormData).languages && (serviceData as TourGuideFormData).languages.length > 0 && (
                      <div>
                        <span className="text-gray-600 block mb-2">Languages:</span>
                        <div className="flex flex-wrap gap-2">
                          {(serviceData as TourGuideFormData).languages.map((lang, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <Languages className="w-3 h-3" />
                              <span>{lang}</span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                {(serviceData as TourGuideFormData).locations && (serviceData as TourGuideFormData).locations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Navigation className="w-5 h-5 text-blue-600" />
                        <span>Service Areas</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {(serviceData as TourGuideFormData).locations.map((location, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{location.district}, {location.province}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Custom Tabs Section */}
            {serviceData.tabsSection && serviceData.tabsSection.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mountain className="w-5 h-5 text-primary-600" />
                    <span>Additional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceData.tabsSection.map((tab: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <CardTitle className="text-lg">{tab.heading}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 whitespace-pre-wrap">{tab.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-primary-600" />
                  <span>Image Gallery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!serviceData?.images || serviceData.images.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={serviceData.images[selectedImageIndex]?.imageUrl}
                        alt={`Service image ${selectedImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {serviceData.images.length}
                      </div>
                    </div>
                    
                    {serviceData.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {serviceData.images.map((image: ImageData, index: number) => (
                          <button
                            key={image.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image.imageUrl}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span>Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!serviceData?.policySection || serviceData.policySection.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No policies defined</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceData.policySection.map((policy: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary-500">
                        <CardHeader>
                          <CardTitle className="text-lg">{policy.heading}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 whitespace-pre-wrap">{policy.policy}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <span>Availability Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!serviceData?.availabilitySlots || serviceData.availabilitySlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No availability schedule set</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceData.availabilitySlots.map((slot: any, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{slot.dayOfWeek}</span>
                            <div className="text-sm text-gray-600">
                              {slot.openTime && slot.closeTime ? (
                                <span>{slot.openTime} - {slot.closeTime}</span>
                              ) : (
                                <Badge variant="secondary">Closed</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ServiceViewPage;
