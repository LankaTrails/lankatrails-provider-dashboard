import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Search, AlertCircle, MapPin } from "lucide-react";
import type { LocationData } from "@/types/serviceTypes";
import { useAuth } from "@/hooks/useAuth";

// Configuration constants
const libraries: ("places" | "geocoding")[] = ["places", "geocoding"];
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center
const SRI_LANKA_BOUNDS = {
  south: 5.919,
  west: 79.5212,
  north: 9.8356,
  east: 81.8795,
};

interface MapSelectorProps {
  location: string;
  onLocationChange: (location: string) => void;
  onLocationSelect?: (locationData: LocationData | undefined) => void;
  onLocationIdSelect?: (locationId: number) => void;
  selectedCoordinates?: { latitude: number; longitude: number };
  error?: string;
  label?: string | null;
  required?: boolean;
  heading?: string | null;
  showBusinessLocationOption?: boolean;
}

const MapSelectorComponent: React.FC<MapSelectorProps> = ({
  location,
  onLocationChange,
  onLocationSelect,
  onLocationIdSelect,
  selectedCoordinates,
  error,
  label,
  required = false,
  heading = null,
  showBusinessLocationOption = false,
}) => {
  const { user } = useAuth();

  // State management
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [animate, setAnimate] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);
  const [useBusinessLocation, setUseBusinessLocation] = useState(false);

  // Refs for map control
  const mapRef = useRef<google.maps.Map | null>(null);
  const hasInitialized = useRef(false); // Prevent multiple initializations

  // Extract location components from geocoding result
  const extractLocationData = (
    result: google.maps.GeocoderResult,
    lat: number,
    lng: number
  ): LocationData => {
    const components = result.address_components;
    const getComponent = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name || null;

    return {
      formattedAddress: result.formatted_address,
      city:
        getComponent("locality") ||
        getComponent("sublocality") ||
        getComponent("administrative_area_level_2") ||
        "",
      district: getComponent("administrative_area_level_2") || "",
      province: getComponent("administrative_area_level_1") || "",
      country: getComponent("country") || "",
      postalCode: getComponent("postal_code") || "",
      latitude: lat,
      longitude: lng,
    };
  };

  // Main handler for coordinate selection and reverse geocoding
  const handleGeocodeResult = useCallback(
    (latLng: google.maps.LatLng) => {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setMarkerPosition({ lat, lng });

      // Reverse geocode to get address
      new window.google.maps.Geocoder()
        .geocode({ location: latLng })
        .then((response) => {
          if (response.results?.[0]) {
            const locationData = extractLocationData(
              response.results[0],
              lat,
              lng
            );
            onLocationChange(locationData.formattedAddress);
            onLocationSelect?.(locationData);
          }
        })
        .catch((error) => {
          console.error("Reverse geocoding failed:", error);
          // Fallback to coordinates if geocoding fails
          const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationChange(fallbackAddress);
          onLocationSelect?.({
            formattedAddress: fallbackAddress,
            city: "",
            district: "",
            province: "",
            country: "",
            postalCode: "",
            latitude: lat,
            longitude: lng,
          });
        });
    },
    [onLocationChange, onLocationSelect]
  );

  // Handle autocomplete place selection
  const onPlaceChanged = useCallback(() => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry?.location) {
      console.warn("No location data for this place");
      return;
    }

    // Pan map to selected location
    if (mapRef.current) {
      mapRef.current.panTo(place.geometry.location);
      mapRef.current.setZoom(16);
    }

    handleGeocodeResult(place.geometry.location);
  }, [autocomplete, handleGeocodeResult]);

  // Map initialization callback
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  // Handle map clicks
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        handleGeocodeResult(e.latLng);
      }
    },
    [handleGeocodeResult]
  );

  // Handle marker drag
  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });

        // Reverse geocode new position
        new window.google.maps.Geocoder()
          .geocode({ location: e.latLng })
          .then((response) => {
            if (response.results?.[0]) {
              const locationData = extractLocationData(
                response.results[0],
                lat,
                lng
              );
              onLocationChange(locationData.formattedAddress);
              onLocationSelect?.(locationData);
            }
          });
      }
      setAnimate(true);
    },
    [onLocationChange, onLocationSelect]
  );

  // Setup autocomplete with Sri Lanka restrictions
  const onAutocompleteLoad = useCallback(
    (autocompleteInstance: google.maps.places.Autocomplete) => {
      setAutocomplete(autocompleteInstance);
      autocompleteInstance.setComponentRestrictions({ country: "lk" });
      autocompleteInstance.setBounds(
        new google.maps.LatLngBounds(
          new google.maps.LatLng(SRI_LANKA_BOUNDS.south, SRI_LANKA_BOUNDS.west),
          new google.maps.LatLng(SRI_LANKA_BOUNDS.north, SRI_LANKA_BOUNDS.east)
        )
      );
    },
    []
  );

  // Initialize map with selected coordinates once
  useEffect(() => {
    if (mapLoaded && selectedCoordinates && !hasInitialized.current) {
      const { latitude, longitude } = selectedCoordinates;
      const latLng = new google.maps.LatLng(latitude, longitude);
      handleGeocodeResult(latLng);
      hasInitialized.current = true;
    }
  }, [mapLoaded, selectedCoordinates, handleGeocodeResult]);

  return (
    <LoadScript
      googleMapsApiKey={"AIzaSyAFJ8_eIjeXNhtS5TeuDWwswREqxO4FsGU"}
      libraries={libraries}
      region="lk"
    >
      <div className="bg-transparent rounded-lg">
        {heading && (
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {heading}
          </h3>
        )}
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>

            {/* Business Location Checkbox */}
            {showBusinessLocationOption && user?.location && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={useBusinessLocation}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setUseBusinessLocation(checked);

                      if (checked && user?.location) {
                        // Use business location - cast to LocationData for compatibility
                        const businessLocation = user.location as any;
                        onLocationChange(
                          businessLocation.formattedAddress || ""
                        );
                        onLocationIdSelect?.(businessLocation.locationId || 0);
                        onLocationSelect?.(undefined);

                        // Update map position
                        const businessPosition = {
                          lat: businessLocation.latitude || 0,
                          lng: businessLocation.longitude || 0,
                        };
                        setMarkerPosition(businessPosition);

                        // Pan map to business location
                        if (mapRef.current) {
                          mapRef.current.panTo(businessPosition);
                          mapRef.current.setZoom(16);
                        }
                      } else {
                        // Clear selection when unchecked
                        onLocationChange("");
                        onLocationIdSelect?.(0);
                        setMarkerPosition(null);
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                      <MapPin className="h-4 w-4" />
                      Use same as business location
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      {(user.location as any).formattedAddress ||
                        "Business location"}
                    </p>
                  </div>
                </label>
              </div>
            )}

            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
              fields={["formatted_address", "geometry", "name"]}
            >
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-primary-400"
                  } ${
                    useBusinessLocation ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Search for a location..."
                  disabled={useBusinessLocation}
                />
                <div className="absolute right-3 top-2.5">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Autocomplete>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600  p-3 rounded-md">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div>
            <div className="w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={markerPosition || DEFAULT_CENTER}
                zoom={markerPosition ? 16 : 7}
                onLoad={onMapLoad}
                onClick={onMapClick}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  draggable: true,
                  scrollwheel: true,
                  mapTypeControl: false,
                  fullscreenControl: false,
                  streetViewControl: false,
                  restriction: {
                    latLngBounds: {
                      north: 10.0,
                      south: 5.8,
                      east: 82.0,
                      west: 79.3,
                    },
                  },
                  // styles: lankaTrailsMapStyle,
                }}
              >
                {/* Draggable Marker */}
                {mapLoaded && markerPosition && (
                  <Marker
                    position={markerPosition}
                    draggable
                    animation={
                      animate ? google.maps.Animation.BOUNCE : undefined
                    }
                    title="Drag to set service location"
                    icon={{
                      url: "/public/orange-marker.svg",
                      scaledSize: new window.google.maps.Size(40, 40),
                      anchor: new window.google.maps.Point(20, 40),
                    }}
                    onClick={() => setInfoOpen(true)}
                    onDragStart={() => setAnimate(false)}
                    onDragEnd={onMarkerDragEnd}
                  />
                )}

                {/* Info Window */}
                {infoOpen && markerPosition && (
                  <InfoWindow
                    position={markerPosition}
                    onCloseClick={() => setInfoOpen(false)}
                  >
                    <div>
                      <h4>Service Location</h4>
                      <p>Drag marker to adjust position</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>

            {/* Coordinates Display */}
            {markerPosition && (
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Coordinates: {markerPosition.lat.toFixed(6)},{" "}
                  {markerPosition.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapSelectorComponent;
