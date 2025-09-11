import {
  getApproximatStreetView,
  getStreetViewIframe,
  getStreetViewImage,
} from "../services/googleService.js";

export const searchLocation = async (req, res) => {
  try {
    const { lat, lng, heading = 0, pitch = 0, fov = 90 } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const loc = await getApproximatStreetView(
      lat,
      lng,
      heading,
      pitch,
      fov,
      500
    );

    let iframeUrl = '';

    if (loc) {
      iframeUrl = getStreetViewIframe(
        loc.lat,
        loc.lng,
        heading,
        pitch,
        fov
      );
    } else {
      iframeUrl = getStreetViewIframe(
        lat,
        lng,
        heading,
        pitch,
        fov
      );
    }

    return res.json({ iframeUrl });
  } catch (error) {
    console.error("Street View search error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const confirmCapture = async (req, res) => {
  try {
    const { panoLat, panoLng, heading = 0 } = req.body;

    if (!panoLat || !panoLng) {
      return res
        .status(400)
        .json({ error: "panoLat and panoLng are required" });
    }

    // Build static image URL for the captured location
    const imageUrl = getStreetViewImage(panoLat, panoLng, heading);

    return res.json({
      success: true,
      panoLat,
      panoLng,
      heading,
      imageUrl,
    });
  } catch (error) {
    console.error("Confirm capture error:", error);
    return res.status(500).json({ error: "Internally server error" });
  }
};
