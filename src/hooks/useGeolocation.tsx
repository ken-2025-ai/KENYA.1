import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    location: null,
    loading: false,
    error: null,
  });

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName = data.address?.city || data.address?.town || data.address?.county || 'Unknown Location';
          
          setState({
            latitude,
            longitude,
            location: locationName + ', Kenya',
            loading: false,
            error: null,
          });
        } catch (error) {
          setState({
            latitude,
            longitude,
            location: 'Kenya',
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Unable to retrieve your location',
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return {
    ...state,
    requestLocation,
  };
};
