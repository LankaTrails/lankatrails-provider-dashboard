import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import type { LocationData } from '@/types/serviceTypes';

interface MapSelectorProps {
  location: string;
  onLocationChange: (location: string) => void;
  onLocationSelect?: (locationData: LocationData) => void;
  selectedCoordinates?: { latitude: number; longitude: number };
}

const MapSelectorComponent: React.FC<MapSelectorProps> = ({
  location,
  onLocationChange,
  onLocationSelect,
  selectedCoordinates
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);

  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) return;
    
    setIsSearching(true);
    // Mock search results - in real app, this would call a geocoding API
    setTimeout(() => {
      const mockResults: LocationData[] = [
        { address: `${query} - Colombo, Sri Lanka`, latitude: 6.9271, longitude: 79.8612 },
        { address: `${query} - Kandy, Sri Lanka`, latitude: 7.2906, longitude: 80.6337 },
        { address: `${query} - Galle, Sri Lanka`, latitude: 6.0535, longitude: 80.2210 }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleLocationSelect = (locationData: LocationData) => {
    onLocationChange(locationData.address);
    onLocationSelect?.(locationData);
    setSearchResults([]);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Location</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => {
                onLocationChange(e.target.value);
                handleLocationSearch(e.target.value);
              }}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Enter location or search"
            />
            <div className="absolute right-3 top-2.5">
              {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-1 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleLocationSelect(result)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm">{result.address}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Map View
          </label>
          <div className="w-full h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
            {selectedCoordinates ? (
              <div className="absolute inset-0 bg-green-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-700">Location Selected</p>
                  <p className="text-xs text-gray-500">
                    {selectedCoordinates.latitude.toFixed(4)}, {selectedCoordinates.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Select location to view on map</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelectorComponent;