import PropType from "prop-types";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

export default function MapView({ coords }) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
      <Map
        zoom={19}
        center={coords}
        gestureHandling={"cooperative"}
        mapTypeId="hybrid"
        mapId={import.meta.env.VITE_MAP_ID}
      >
        <AdvancedMarker position={coords}>
          <Pin
            background={"#0469FB"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
}

MapView.propTypes = {
  coords: PropType.object,
};
