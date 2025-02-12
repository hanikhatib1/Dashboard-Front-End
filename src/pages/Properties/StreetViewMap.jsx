import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  StreetViewPanorama,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const apiKey = "AIzaSyCtooAZirqBeZKsUV_RyUr6vGQU9Zhlc1I"; // استبدله بمفتاحك الصحيح

export default function StreetViewMap({ address }) {
  const [location, setLocation] = useState(null);
  const [viewOptions, setViewOptions] = useState(null);

  // تحميل Google Maps API قبل تنفيذ أي كود متعلق به
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["geometry"],
  });

  const geocodeAddress = useCallback(async () => {
    if (!address || !isLoaded) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ lat, lng });
        getStreetView({ lat, lng });
      } else {
        console.error("Geocoding failed:", data.status);
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  }, [address, isLoaded]);

  const getStreetView = useCallback((propertyLocation) => {
    if (!window.google) return;

    const streetViewService = new window.google.maps.StreetViewService();
    const radius = 50; // البحث ضمن 50 مترًا

    streetViewService.getPanorama(
      { location: propertyLocation, radius },
      (data, status) => {
        if (status === "OK") {
          const panoramaLocation = data.location.latLng;
          const heading = window.google.maps.geometry.spherical.computeHeading(
            panoramaLocation,
            propertyLocation
          );

          setViewOptions({
            position: panoramaLocation, // أقرب موقع Street View
            pov: { heading, pitch: 0 },
            visible: true,
          });
        } else {
          console.error("No Street View found nearby:", status);
        }
      }
    );
  }, []);

  useEffect(() => {
    geocodeAddress();
  }, [geocodeAddress]);

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div>
      {location ? (
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={14}>
          {viewOptions && <StreetViewPanorama {...viewOptions} />}
        </GoogleMap>
      ) : (
        <p>Loading Street View for: {address}...</p>
      )}
    </div>
  );
}