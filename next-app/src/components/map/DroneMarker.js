import { Marker, Polyline } from "@react-google-maps/api";
import { useDeviceContext } from "@/providers/devices/DevicesProvider";

const DroneMarker = ({ droneData }) => {
  const { selectedDevice } = useDeviceContext();
  const normalizeHeading = (heading) => {
    let normalizedHeading = heading % 360;
    if (normalizedHeading < 0) {
      normalizedHeading += 360;
    }
    return normalizedHeading;
  };

  return (
    droneData?.data?.latitude && (
      <div>
        <Marker
          position={{
            lat: droneData?.data?.latitude ?? 0,
            lng: droneData?.data?.longitude ?? 0,
          }}
          icon={{
            url:
              `data:image/svg+xml;base64,` +
              btoa(`
            <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  transform="rotate(${normalizeHeading(
              droneData?.data?.attitude_head ?? 0
            )} 0 0)">
  <!-- Filled Circle -->
  <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
  
  <!-- Arrow Pointing Up -->
  <path fill="#ffffff" d="M12 6l-6 8h4v4h4v-4h4l-6-8z"/>
</svg>`),
            // strokeWeight: 4,
            // strokeColor: themeConfig.theme.extend.colors[`blue-annotation`],
            scaledSize: new google.maps.Size(50, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(25, 25), // anchor
            // rotation: 50, //normalizeHeading(droneData?.data?.attitude_head ?? 0),
          }}
          label={{
            text: selectedDevice.device,
            color: "white",
            fontSize: "18px",
            className: "shadow-xl bg-blue-annotation rounded-md p-1 mt-20",
          }}
          draggable={false}
        />

        <Polyline
          path={[
            {
              lat: droneData?.data?.latitude ?? 0,
              lng: droneData?.data?.longitude ?? 0,
            },
            {
              lat: droneData?.data?.["53-0-0"]?.measure_target_latitude ?? 0,
              lng: droneData?.data?.["53-0-0"]?.measure_target_longitude ?? 0,
            },
          ]}
          options={{
            strokeOpacity: 0,
            icons: [
              {
                icon: {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 1,
                  scale: 4,
                  strokeColor: "#ffffff",
                },
                offset: "0",
                repeat: "20px",
              },
            ],
          }}
        />
        <Marker
          position={{
            lat: droneData?.data?.["53-0-0"]?.measure_target_latitude ?? 0,
            lng: droneData?.data?.["53-0-0"]?.measure_target_longitude ?? 0,
          }}
          icon={{
            url:
              `data:image/svg+xml;base64,` +
              btoa(`
         <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <!-- Horizontal Line -->
  <line x1="4" y1="12" x2="20" y2="12" stroke="#ef4444" stroke-width="2"/>
  
  <!-- Vertical Line -->
  <line x1="12" y1="4" x2="12" y2="20" stroke="#ef4444" stroke-width="2"/>
  
  <!-- Outer Circles -->
  <circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2" fill="none"/>
  <circle cx="12" cy="12" r="2" stroke="#ef4444" stroke-width="2" fill="none"/>
</svg>`),
            // strokeWeight: 4,
            // strokeColor: themeConfig.theme.extend.colors[`blue-annotation`],
            scaledSize: new google.maps.Size(30, 30), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(15, 15), // anchor
            // rotation: 50, //normalizeHeading(droneData?.data?.attitude_head ?? 0),
          }}
          draggable={false}
        />
      </div>
    )
  );
};

export default DroneMarker;
