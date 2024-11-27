import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { useGetAppealsMutation } from "@/redux/apiSlice";
import { Search } from "lucide-react";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

const SearchAppeal = ({ setAppeal }) => {
  const [searchText, setSearchText] = React.useState("");
  const [getAppeal, { isLoading, isError }] = useGetAppealsMutation();
  const [appeals, setAppeals] = React.useState([]);
  const ulRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const handleSearchAppeal = async () => {
    const res = await getAppeal(`search=${searchText}`);
    if ("data" in res) setAppeals(res.data.data);
    else setAppeals([]);
  };

  useEffect(() => {
    if (searchText !== "") {
      handleSearchAppeal();
    } else {
      setAppeals([]);
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
      className={` ${
        searchText !== "" ? "rounded-tl-[8px]" : "rounded-[8px]"
      } border flex flex-1 relative h-[40px] rounded-tr-[8px] w-full text-[#A1A1AA]`}
    >
      <Search
        className="absolute top-0 left-1 w-[20px] h-full z-10"
        color="#A1A1AA"
      />
      <Input
        type="Search"
        placeholder="Search Appeal"
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
              {appeals.length && (
                <ul
                  ref={ulRef}
                  className="rounded-b-[8px] absolute w-[calc(100%+2px)] scroll-right overflow-y-auto h-auto -left-[1px] top-full border  bg-white shadow-custom"
                >
                  {appeals.slice(0, 8).map((appeal, index) => (
                    <li
                      key={appeal}
                      className={`hover:bg-primary px-2 py-2 flex-col justify-start leading-7 text-[#80838E] hover:text-white cursor-pointer flex items-start ${
                        index === 0 ? "" : "border-t"
                      }`}
                      onClick={() => {
                        setAppeal(appeal);
                        setSearchText("");
                        setAppeals([]);
                      }}
                    >
                      <span>{`${appeal.client_address}`}</span>
                      <span className="text-sm" >{`${appeal.client_first_name} ${appeal.client_last_name}`}</span>
                    </li>
                  ))}
                </ul>
              )}
              {appeals.length === 0 && searchText !== "" && (
                <ul className="absolute flex justify-center items-center w-[calc(100%+2px)] scroll-right overflow-y-auto h-[100px]  -left-[1px] top-full border bg-white shadow-custom">
                  <p className="py-2 px-4">Not Found Appeals</p>
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

SearchAppeal.propTypes = {
  setAppeal: PropTypes.func,
};

export default SearchAppeal;
