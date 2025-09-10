import axios from "axios";

export const geocodeAddress = async (address) => {
  const resp = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    { params: { address, key: process.env.GOOGLE_MAPS_API_KEY } }
  );
console.log(process.env.GOOGLE_MAPS_API_KEY);

  if (resp.data.status !== "OK") {
    throw new Error("Geocoding failed");
  }

  return resp.data.results[0].geometry.location; // { lat, lng }
};

export const getStreetViewImage = (lat, lng, heading = 0) => {
  return `https://maps.googleapis.com/maps/api/streetview?size=640x360&location=${lat},${lng}&heading=${heading}&pitch=0&fov=90&key=${process.env.GOOGLE_MAPS_API_KEY}`;
};

// Build Street View iframe
export const getStreetViewIframe = (lat, lng, heading = 0, pitch = 0, fov = 90) => {
  return `https://www.google.com/maps/embed/v1/streetview?key=${process.env.GOOGLE_MAPS_API_KEY}&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&fov=${fov}`;
};
