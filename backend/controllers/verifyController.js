import { geocodeAddress, getStreetViewImage } from "../services/googleService.js";
import { metersBetween } from "../utils/distance.js";
import { v4 as uuidv4 } from "uuid";

export const verifyAddress = async (req, res) => {
  try {
    const {
      bvn,
      inputAddress,
      deviceLat,
      deviceLng,
      deviceAccuracy,
      panoLat,
      panoLng,
      heading
    } = req.body;

    // 1. Geocode inputAddress
    const { lat: addressLat, lng: addressLng } = await geocodeAddress(inputAddress);

    // 2. Compute distance
    const distance = metersBetween(deviceLat, deviceLng, addressLat, addressLng);

    // 3. Get Street View image URL
    const imageUrl = getStreetViewImage(panoLat || deviceLat, panoLng || deviceLng, heading);

    // 4. Decide result (simple rule)
    let result = "pending";
    if (distance <= 50 && deviceAccuracy <= 50) {
      result = "approved";
    } else if (distance > 200) {
      result = "rejected";
    }

    // 5. Build record (later we save to DB)
    const record = {
      id: uuidv4(),
      bvn,
      inputAddress,
      addressLat,
      addressLng,
      deviceLat,
      deviceLng,
      deviceAccuracy,
      panoLat,
      panoLng,
      heading,
      distance,
      imageUrl,
      result,
      createdAt: new Date()
    };

    res.json({ success: true, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
