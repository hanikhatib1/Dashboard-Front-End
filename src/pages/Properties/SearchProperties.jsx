import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { useSearchPropertiesMutation } from "@/redux/apiSlice";
import { formatePin } from "@/utiles/formatePin";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

const SearchPropertiesComponent = ({
  goToComparison = false,
  className,
  isState,
  setProperty,
  containerClassName,
}) => {
  const [searchText, setSearchText] = useState("");
  const [properties, setProperties] = useState([]);
  const [searchFor, setSearchFor] = useState("address");
  const [searchProperties, { isLoading, isError }] =
    useSearchPropertiesMutation();

  const handleSearchProperties = async () => {
    const res = await searchProperties(
      `search=${searchText}&search_for=${searchFor}`
    );
    if ("data" in res) setProperties(res.data.data);
    else setProperties([]);
  };

  useEffect(() => {
    if (searchText !== "") {
      handleSearchProperties();
    } else {
      setProperties([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, searchFor]);

  return (
    <div className={`flex ${containerClassName} w-full max-w-[650px]`}>
      <div
        className={`${
          searchText !== "" ? "rounded-t-[8px]" : "rounded-[8px]"
        } border relative h-[40px] max-w-full md:max-w-[500px] min-w-max w-full text-[#A1A1AA] z-10 ${className}`}
      >
        <Search
          className="absolute top-0 left-1 w-[20px] h-full z-10"
          color="#A1A1AA"
        />
        <Input
          type="Search"
          placeholder="Search"
          onChange={(e) => setSearchText(e.target.value)}
          className="border-none pl-[30px] !border-b bg-white rounded-[8px] focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-0 !shadow-none absolute top-0 left-0 w-full h-full"
        />
        {searchText !== "" && (
          <>
            {isLoading ? (
              <ul className="rounded-b-[8px] absolute flex justify-center items-center w-[calc(100%+2px)] scroll-right overflow-y-auto h-[100px] top-full -left-[1px] border bg-white shadow-custom">
                <Loader />
              </ul>
            ) : isError ? (
              <ul className="rounded-b-[8px] absolute w-[calc(100%+5px)] scroll-right overflow-y-auto h-[100px] left-0 top-[calc(100%+3px)] border bg-white shadow-custom">
                <p>Error</p>
              </ul>
            ) : (
              <>
                {properties.length && (
                  <ul className="rounded-b-[8px] absolute w-[calc(100%+2px)] scroll-right overflow-y-auto max-h-[300px] h-auto -left-[1px] top-full border  bg-white shadow-custom">
                    {properties.map((property, index) => (
                      <li
                        key={property}
                        className={`hover:bg-primary hover:text-white cursor-pointer flex justify-between items-center ${
                          index === 0 ? "" : "border-t"
                        }`}
                      >
                        {isState ? (
                          <Button
                            onClick={() => {
                              setProperty(property);
                              setProperties([]);
                              setSearchText("");
                            }}
                            className="flex flex-col items-start w-full py-2 px-4 bg-white"
                          >
                            <span>{`${property.address}, ${property.city}, ${property.state}, ${property.zip_code}`}</span>
                            <span>{formatePin(property.pin)}</span>
                          </Button>
                        ) : (
                          <Link
                            to={
                              goToComparison
                                ? `/properties/${property.pin}/comparison`
                                : `/properties/${property.pin}`
                            }
                            onClick={() => {
                              setProperties([]);
                              setSearchText("");
                            }}
                            className="flex flex-col w-full py-2 px-4"
                          >
                            <span>{`${property.address}, ${property.city}, ${property.state}, ${property.zip_code}`}</span>
                            <span>{formatePin(property.pin)}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {properties.length === 0 && searchText !== "" && (
                  <ul className="absolute flex justify-center items-center w-[calc(100%+2px)] scroll-right overflow-y-auto h-[100px]  -left-[1px] top-full border bg-white shadow-custom">
                    <p className="py-2 px-4">Not Found Address</p>
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </div>
     {/*  <Select
        onValueChange={(e) => setSearchFor(e)}
        className="focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        defaultValue={searchFor}
      >
        <SelectTrigger className="w-max md:w-[180px] focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-[8px]">
          <SelectValue placeholder={searchFor} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="address">Address</SelectItem>
          <SelectItem value="pin">Pin</SelectItem>
        </SelectContent>
      </Select> */}
    </div>
  );
};

SearchPropertiesComponent.propTypes = {
  goToComparison: PropTypes.bool,
  className: PropTypes.string,
  setProperty: PropTypes.func,
  isState: PropTypes.bool,
};

export default SearchPropertiesComponent;
