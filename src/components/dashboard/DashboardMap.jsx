import PropType from "prop-types";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";

export default function DashboardMap({ markers }) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_FIREBASE_API_KEY}>
      <Map
        zoom={15}
        center={{ lat: 16.071944602703823, lng: 120.33983299327511 }}
        gestureHandling={"greedy"}
        mapTypeId="satellite"
        style={{ borderRadius: "8px", height: "500px" }}
        mapId={import.meta.env.VITE_MAP_ID}
      >
        {markers.map((coords, index) => (
          <AdvancedMarker key={index} position={coords}>
            <Pin background="#700e01" borderColor="#700e01" glyphColor="white">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/big-cartel-svgrepo-com.png"
                  width="13"
                  height="13"
                />
              </div>
            </Pin>
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}

DashboardMap.propTypes = {
  markers: PropType.array,
};
