import Switch from "@/components/Switch";
import SearchPropertiesComponent from "../SearchProperties";
import Loader from "@/components/Loader";
import PropertyCard from "./PropertyCard";
import PropTypes from "prop-types";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const Maps = ({
  openMaps,
  setOpenMaps,
  onePropertyLoading,
  oneProperty,
  listOfPropertiesLoading,
  listOfProperties,
}) => {
  return (
    <div className="p-4 flex flex-col gap-8">
      <div className="flex justify-between flex-col md:flex-row gap-3">
        <SearchPropertiesComponent goToComparison />
        <div className="flex gap-4 justify-end items-center mb-2">
          <p className="text-heading_3 text-[#054985] whitespace-nowrap">View On Map</p>
          <Switch toggle={openMaps} setToggle={setOpenMaps} />
        </div>
      </div>
      <div>
        <p className="text-heading_3">
          <span className="text-primary">Search resul ts</span> “
          {oneProperty && oneProperty.data.address}”
        </p>
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-12">
        <div className="flex-1">
          <div className="flex gap-4 flex-wrap w-full justify-center">
            {onePropertyLoading ? (
              <Loader />
            ) : (
              oneProperty && (
                <PropertyCard
                  className="border flex-1"
                  property={oneProperty?.data}
                />
              )
            )}
            {listOfPropertiesLoading ? (
              <Loader />
            ) : (
              <>
                {listOfProperties &&
                  listOfProperties.data.map((item) => (
                    <PropertyCard
                      property={{
                        ...item,
                        image: item.image.replace(
                          "YOUR_API_KEY",
                          "AIzaSyAwlgLHEcMCQaFZ_LvDQop-VDHRzBvRr6U"
                        ),
                      }}
                      className="flex-1"
                      key={item.id}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
        <div className="max-w-[605px] w-full md:w-[605px]">
          <MapContainer
            center={
              oneProperty && [
                oneProperty.data.latitude,
                oneProperty.data.longitude,
              ]
            }
            zoom={16}
            className="h-[600px] rounded-[16px] z-[1]"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {oneProperty && (
              <Marker
                position={[
                  oneProperty.data.latitude,
                  oneProperty.data.longitude,
                ]}
                onClick={() => alert("clicked")}
                opacity={1}
                icon={L.icon({
                  iconUrl: icon,
                  shadowUrl: iconShadow,
                  iconSize: [40, 60],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [60, 60],
                })}
              >
                <Popup className="!p-0 h-[240px] w-0">
                  <PropertyCard
                    property={oneProperty?.data}
                    className="flex-1 z-10 absolute top-0 left-0 w-[272px] h-[239px]"
                  />{" "}
                </Popup>
              </Marker>
            )}
            {listOfProperties &&
              listOfProperties.data.map((item, index) => (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  onClick={() => alert("clicked")}
                  opacity={0.8}
                >
                  <Popup
                    className="!p-0 h-[240px] w-0"
                    keepInView={index === 0}
                  >
                    <PropertyCard
                      property={{
                        ...item,
                        image: item.image.replace(
                          "YOUR_API_KEY",
                          "AIzaSyAwlgLHEcMCQaFZ_LvDQop-VDHRzBvRr6U"
                        ),
                      }}
                      className="flex-1 z-10 absolute top-0 left-0 w-[272px] h-[239px]"
                      key={item.id}
                    />{" "}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

Maps.propTypes = {
  openMaps: PropTypes.bool,
  setOpenMaps: PropTypes.func,
  onePropertyLoading: PropTypes.bool,
  oneProperty: PropTypes.object,
  listOfPropertiesLoading: PropTypes.bool,
  listOfProperties: PropTypes.array,
};

export default Maps;
