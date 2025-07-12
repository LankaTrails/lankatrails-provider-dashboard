import React, { useState, useRef, useCallback } from "react";
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { Search, AlertCircle } from "lucide-react";
import type { LocationData } from "@/types/serviceTypes";
import type { n } from "node_modules/framer-motion/dist/types.d-B_QPEvFK";

const libraries: ("places" | "geocoding")[] = ["places", "geocoding"];

interface MapSelectorProps {
  location: string;
  onLocationChange: (location: string) => void;
  onLocationSelect?: (locationData: LocationData) => void;
  selectedCoordinates?: { latitude: number; longitude: number };
  error?: string;
  label?: string | null;
  required?: boolean;
  heading?: string | null;
}

const MapSelectorComponent: React.FC<MapSelectorProps> = ({
  location,
  onLocationChange,
  onLocationSelect,
  selectedCoordinates,
  error,
  label,
  required = false,
  heading = null,
}) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract components
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
        getComponent("administrative_area_level_2"),
      district: getComponent("administrative_area_level_2"),
      province: getComponent("administrative_area_level_1"),
      country: getComponent("country"),
      postalCode: getComponent("postal_code"),
      latitude: lat,
      longitude: lng,
    };
  };

  // Run reverse geocode and trigger callbacks
  const handleGeocodeResult = (latLng: google.maps.LatLng) => {
    new window.google.maps.Geocoder()
      .geocode({ location: latLng })
      .then((response) => {
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          const lat = latLng.lat();
          const lng = latLng.lng();

          const locationData = extractLocationData(result, lat, lng);
          onLocationChange(locationData.formattedAddress);
          onLocationSelect?.(locationData);
        }
      })
      .catch((error) => {
        console.error("Reverse geocoding failed:", error);
        const lat = latLng.lat();
        const lng = latLng.lng();

        onLocationChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        onLocationSelect?.({
          formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          city: null,
          district: null,
          province: null,
          country: null,
          postalCode: null,
          latitude: lat,
          longitude: lng,
        });
      });
  };

  // When place is selected
  const onPlaceChanged = useCallback(() => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry?.location) {
      console.warn("No location data for this place");
      return;
    }

    const location = place.geometry.location;

    // Center map
    if (mapRef.current) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(16);
    }

    // Do reverse geocoding
    handleGeocodeResult(location);
  }, [autocomplete, onLocationChange, onLocationSelect]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        handleGeocodeResult(e.latLng);
      }
    },
    [onLocationChange, onLocationSelect]
  );

  return (
    <LoadScript
      googleMapsApiKey={"AIzaSyA47Q-I515EK0DU4pvk5jgUcatYcdnf8cY"}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
            <Autocomplete
              onLoad={(autocomplete) => {
                setAutocomplete(autocomplete);
                autocomplete.setComponentRestrictions({ country: "lk" });
                autocomplete.setBounds(
                  new google.maps.LatLngBounds(
                    new google.maps.LatLng(5.919, 79.5212),
                    new google.maps.LatLng(9.8356, 81.8795)
                  )
                );
              }}
              onPlaceChanged={onPlaceChanged}
              fields={["formatted_address", "geometry", "name"]}
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={location}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-primary-400"
                  }`}
                  placeholder="Search places in Sri Lanka"
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

          <div>
            <div className="w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={
                  selectedCoordinates
                    ? {
                        lat: selectedCoordinates.latitude,
                        lng: selectedCoordinates.longitude,
                      }
                    : { lat: 7.8731, lng: 80.7718 }
                }
                zoom={selectedCoordinates ? 16 : 7}
                onLoad={onMapLoad}
                onClick={onMapClick}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {selectedCoordinates && (
                  <Marker
                    position={{
                      lat: selectedCoordinates.latitude,
                      lng: selectedCoordinates.longitude,
                    }}
                    draggable
                    onDragEnd={(e) => {
                      if (e.latLng) {
                        handleGeocodeResult(e.latLng);
                      }
                    }}
                  />
                )}
              </GoogleMap>
            </div>
            {selectedCoordinates && (
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Coordinates: {selectedCoordinates.latitude.toFixed(6)},{" "}
                  {selectedCoordinates.longitude.toFixed(6)}
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
