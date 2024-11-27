import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import PropTypes from "prop-types";
import { useGetAddressGoogleMutation } from "@/redux/apiSlice";

const AddressSearch = ({ setAddressData, defaultAddress }) => {
  const [address, setAddress] = useState(defaultAddress ?? "");
  const [locations, setLocations] = useState([]);
  const hasLocations = locations.length > 0;
  const openLocationsWrapper = hasLocations;
  const mainRef = useRef(null);
  const [getAddress] = useGetAddressGoogleMutation();

  const handleSearch = async (e) => {
    const { value } = e.target;
    setAddress(value);

    if (value.length > 0) {
      /* const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${address.split(" ").join("+")}&types=address&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      ); */
      /* const res = await fetch(
        "https://khatib-law-v1-3185dfe428a5.herokuapp.com/property/search_google_address",
        {
          method: "POST",
          body: {
            address,
          },
        }
      ); */
      const res = await getAddress({ address });
      const predictions = res.data?.result ?? [];
      console.log("predictions", predictions);
      setLocations(predictions);
    } else {
      setLocations([]);
    }
  };

  const handleSelectLocation = async (location) => {
    const description = location.description;
    setAddress(description);
    setLocations([]);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${description.split(" ").join("+")}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const addressComponents = data.results[0].address_components;
        let city, state, postalCode;

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.short_name;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
        });
        setAddressData({
          city,
          state,
          zip_code: postalCode,
          address: description,
        });
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainRef.current && !mainRef.current.contains(event.target)) {
        setLocations([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mainRef]);

  return (
    <div className="h-auto relative" ref={mainRef}>
      <div className="w-full flex flex-col gap-2 flex-2 overflow-hidden">
        <label htmlFor="address" className="text-body text-[#80838E]">
          Address
        </label>
        <Input
          id="address"
          type="search"
          className={`h-[48px] ${openLocationsWrapper ? "rounded-t-[8px]" : "rounded-[8px]"} focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-0 !shadow-none`}
          name="address"
          placeholder="Search for an address"
          value={address}
          onChange={handleSearch}
        />
      </div>
      {openLocationsWrapper && (
        <ul className=" w-full bg-white border border-t-0 rounded-b-[8px]">
          {locations.map((location, index) => (
            <li
              key={index}
              className={`p-3 border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F9FAFB] ${index + 1 === locations.length ? "border-b-0" : ""}`}
              onClick={() => {
                setAddressData({
                  address: location.full_address.split(",")[0],
                  city: location.city,
                  state: location.state,
                  zip_code: location.zip_code,
                });
                setAddress(location.full_address.split(",")[0]);
                setLocations([]);
              }}
            >
              {location.full_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

AddressSearch.propTypes = {
  setAddressData: PropTypes.func,
  defaultAddress: PropTypes.string,
};

export default AddressSearch;
