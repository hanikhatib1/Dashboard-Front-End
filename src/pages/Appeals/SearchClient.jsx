import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetClientsMutation } from "@/redux/apiSlice";
import { Search } from "lucide-react";
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const SearchClient = ({ setClient }) => {
  const [searchText, setSearchText] = React.useState("");
  const [getClient, { isLoading, isError }] = useGetClientsMutation();
  const [clients, setClients] = React.useState([]);
  const ulRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const handleSearchProperties = async () => {
    const res = await getClient(`search=${searchText}`);
    if ("data" in res) setClients(res.data.data);
    else setClients([]);
  };

  useEffect(() => {
    if (searchText !== "") {
      handleSearchProperties();
    } else {
      setClients([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ulRef.current &&
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        !ulRef.current.contains(event.target)
      ) {
        setSearchText("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [ulRef]);

  return (
    <div
      ref={inputRef}
      className={` border z-30 ${
        searchText !== "" ? "rounded-tl-[8px]" : "rounded-[8px]"
      } border flex flex-1 relative h-[40px] rounded-tr-[8px] w-full text-[#A1A1AA]`}
    >
      <Search
        className="absolute top-0 left-1 w-[20px] h-full z-10"
        color="#A1A1AA"
      />
      <Input
        type="Search"
        placeholder="Search Client"
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
              {clients.length && (
                <div className="h-[200px] absolute w-[calc(100%+2px)] -left-[1px] top-full overflow-y-auto rounded-b-[8px] border">
                  <ul
                    ref={ulRef}
                    className="scroll-right h-auto bg-white shadow-custom"
                  >
                    {clients.slice(0, 8).map((client, index) => (
                      <li
                        key={client}
                        className={`hover:bg-primary px-2 py-2 leading-7 text-[#80838E] hover:text-white cursor-pointer flex justify-between items-center ${
                          index === 0 ? "" : "border-t"
                        }`}
                        onClick={() => {
                          setClient(client);
                          setSearchText("");
                          setClients([]);
                        }}
                      >
                        {`${client.first_name} ${client.last_name}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {clients.length === 0 && searchText !== "" && (
                <ul className="absolute flex justify-center items-center w-[calc(100%+2px)] scroll-right overflow-y-auto h-[100px]  -left-[1px] top-full border bg-white shadow-custom">
                  <p className="py-2 px-4">Not Found Address</p>
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

SearchClient.propTypes = {
  setClient: PropTypes.func,
};

export default SearchClient;
