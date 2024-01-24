import PropType from "prop-types";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function MapView({ coords }) {
  return (
    <div className="report__map">
      <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
        <Map zoom={19} center={coords} gestureHandling={"cooperative"}>
          <Marker position={coords} />
        </Map>
      </APIProvider>
    </div>
  );
}

MapView.propTypes = {
  coords: PropType.object,
};
