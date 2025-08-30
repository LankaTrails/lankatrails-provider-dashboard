import React, { useState, useRef, useCallback, useEffect } from "react";
import { LoadScript, GoogleMap, InfoWindow } from "@react-google-maps/api";
import { AlertCircle, MapPin } from "lucide-react";
import type { LocationData } from "@/types/serviceTypes";
import { useAuth } from "@/hooks/useAuth";

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const googleMapsId = import.meta.env.VITE_GOOGLE_MAPS_ID;

// Verify Map ID is loaded
if (!googleMapsId) {
  console.warn("VITE_GOOGLE_MAPS_ID is not set in environment variables");
}

// Configuration constants
const libraries: ("places" | "geocoding" | "marker")[] = [
  "places",
  "geocoding",
  "marker",
];
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center

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
  const [placeAutocompleteElement, setPlaceAutocompleteElement] =
    useState<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [advancedMarker, setAdvancedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [useBusinessLocation, setUseBusinessLocation] = useState(false);

  // Refs for map control
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const hasInitialized = useRef(false); // Prevent multiple initializations

  const extractLocationData = (
    result: google.maps.GeocoderResult,
    lat: number,
    lng: number
  ): LocationData => {
    const components = result.address_components;
    const getComponent = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name || null;

    return {
      locationId: null,
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

  const handleGeocodeResult = useCallback(
    (latLng: google.maps.LatLng) => {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setMarkerPosition({ lat, lng });

      if (useBusinessLocation) {
        setUseBusinessLocation(false);
      }

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
          const fallbackAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationChange(fallbackAddress);
          onLocationSelect?.({
            locationId: null,
            formattedAddress: fallbackAddress,
            city: "", district: "", province: "", country: "", postalCode: "",
            latitude: lat, longitude: lng,
          });
        });
    },
    [onLocationChange, onLocationSelect, useBusinessLocation]
  );

  const onPlaceSelected = useCallback(
    async (place: google.maps.places.Place) => {
      if (!place.location) {
        console.warn("No location data for this place");
        return;
      }
      if (mapRef.current) {
        mapRef.current.panTo(place.location);
        mapRef.current.setZoom(16);
      }
      handleGeocodeResult(place.location);
    },
    [handleGeocodeResult]
  );

  const onMapLoad = useCallback(async (map: google.maps.Map) => {
    mapRef.current = map;
    try {
      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      const pin = new PinElement({
        background: "#ff6600",
        borderColor: "#ff4400",
        glyphColor: "#ffffff",
      });
      const marker = new AdvancedMarkerElement({
        map: map, position: null, title: "Drag to set service location",
        content: pin.element, gmpDraggable: true,
      });
      marker.addListener("click", () => setInfoOpen(true));
      setAdvancedMarker(marker);
      await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
      setMapLoaded(true);
    } catch (error) {
      console.error("Error loading Google Maps libraries:", error);
    }
  }, []);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) handleGeocodeResult(e.latLng);
    },
    [handleGeocodeResult]
  );

  const onMarkerDragEnd = useCallback(
    (position: google.maps.LatLng) => {
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        setMarkerPosition({ lat, lng });
        new window.google.maps.Geocoder()
          .geocode({ location: position })
          .then((response) => {
            if (response.results?.[0]) {
              const locationData = extractLocationData(
                response.results[0], lat, lng
              );
              onLocationChange(locationData.formattedAddress);
              onLocationSelect?.(locationData);
            }
          });
      }
    },
    [onLocationChange, onLocationSelect]
  );

  useEffect(() => {
    if (!mapLoaded || !autocompleteRef.current) return;
    const setupAutocomplete = async () => {
      try {
        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({});
        placeAutocomplete.setAttribute("class", "w-full");
        placeAutocomplete.addEventListener("gmp-select", async (event: any) => {
          const place = await event.placePrediction.toPlace();
          await place.fetchFields({ fields: ["location", "formattedAddress"] });
          onPlaceSelected(place);
        });
        if (autocompleteRef.current) {
          autocompleteRef.current.innerHTML = "";
          autocompleteRef.current.appendChild(placeAutocomplete);
        }
        setPlaceAutocompleteElement(placeAutocomplete);
      } catch (error) {
        console.error("Error setting up PlaceAutocompleteElement:", error);
      }
    };
    setupAutocomplete();
  }, [mapLoaded, onPlaceSelected]);

  useEffect(() => {
    if (advancedMarker && markerPosition) {
      advancedMarker.position = new google.maps.LatLng(
        markerPosition.lat, markerPosition.lng
      );
    }
  }, [advancedMarker, markerPosition]);

  useEffect(() => {
    if (advancedMarker) {
      const dragListener = advancedMarker.addListener("dragend", () => {
        if (advancedMarker.position) {
          onMarkerDragEnd(advancedMarker.position as google.maps.LatLng);
        }
      });
      return () => {
        if (dragListener) google.maps.event.removeListener(dragListener);
      };
    }
  }, [advancedMarker, onMarkerDragEnd]);

  // **MODIFIED HOOK**
  // Sync location prop and disabled state with PlaceAutocompleteElement
  useEffect(() => {
    if (placeAutocompleteElement) {
      const inputElement = placeAutocompleteElement.querySelector("input");
      if (inputElement) {
        // Sync the value if it's different
        if (inputElement.value !== location) {
          inputElement.value = location;
        }
        // Sync the disabled state based on the checkbox
        inputElement.disabled = useBusinessLocation;
      }
    }
  }, [location, placeAutocompleteElement, useBusinessLocation]);

  useEffect(() => {
    if (mapLoaded && selectedCoordinates && !hasInitialized.current) {
      const { latitude, longitude } = selectedCoordinates;
      const latLng = new google.maps.LatLng(latitude, longitude);
      handleGeocodeResult(latLng);
      hasInitialized.current = true;
    }
  }, [mapLoaded, selectedCoordinates, handleGeocodeResult]);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries} region="lk">
      <div className="bg-transparent rounded-lg">
        {heading && (
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{heading}</h3>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
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
                        const businessLocation = user.location as any;
                        onLocationChange(businessLocation.formattedAddress || "");
                        onLocationIdSelect?.(businessLocation.locationId || 0);
                        const businessPosition = {
                          lat: businessLocation.latitude || 0,
                          lng: businessLocation.longitude || 0,
                        };
                        setMarkerPosition(businessPosition);
                        if (mapRef.current) {
                          mapRef.current.panTo(businessPosition);
                          mapRef.current.setZoom(16);
                        }
                      } else {
                        onLocationChange("");
                        onLocationIdSelect?.(0);
                        setMarkerPosition(null);
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                      <MapPin className="h-4 w-4" /> Use same as business location
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      {(user.location as any).formattedAddress || "Business location"}
                    </p>
                  </div>
                </label>
              </div>
            )}
            <div className="relative">
              <div ref={autocompleteRef} className="w-full [&>gmp-place-autocomplete-element]:w-full">
                {!mapLoaded && (
                  <input type="text" value={location}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                      error ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-primary-400"
                    } ${ useBusinessLocation ? "bg-gray-100 cursor-not-allowed" : "" }`}
                    placeholder="Search for a location..."
                    disabled={useBusinessLocation}
                  />
                )}
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600  p-3 rounded-md">
                <AlertCircle size={16} /> <span>{error}</span>
              </div>
            )}
          </div>
          <div>
            <div className="w-full h-72 border border-gray-300 rounded-lg overflow-hidden">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={markerPosition || DEFAULT_CENTER}
                zoom={markerPosition ? 16 : 7}
                onLoad={onMapLoad} onClick={onMapClick}
                options={{
                  mapId: googleMapsId,
                  disableDefaultUI: true, zoomControl: true, draggable: true, scrollwheel: true,
                  mapTypeControl: false, fullscreenControl: false, streetViewControl: false,
                  restriction: {
                    latLngBounds: { north: 10.0, south: 5.8, east: 82.0, west: 79.3 },
                  },
                }}
              >
                {infoOpen && markerPosition && (
                  <InfoWindow position={markerPosition} onCloseClick={() => setInfoOpen(false)}>
                    <div>
                      <h4>Service Location</h4>
                      <p>Drag marker to adjust position</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
            {markerPosition && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Coordinates: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapSelectorComponent;