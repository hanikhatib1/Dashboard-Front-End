import React, { useEffect, useState } from "react";
import SearchProperties from "../SearchProperties";
import ComparisonTable from "./ComparisonTable";
import {
  comparisonAssessmentsColumns,
  comparisonSalesColumns,
} from "./TableData";
import {
  useGetListOfPropertiesMutation,
  useGetOnePropertyMutation,
  useGetPropertiesComparisonMutation,
} from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { clearPropertiesList } from "@/redux/features/Properties";
import PropertySheet from "./PropertySheet.jsx";
import PropertyCard from "./PropertyCard";
import { formattedNumber } from "@/utiles/formattedNumber";
import Switch from "@/components/Switch";
import Maps from "./Maps";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import queryString from "query-string";
import NewAppeals from "@/pages/Appeals/NewAppeals";
import FileReportPDF2 from "@/components/FileReportPDF2";

const FilterStatusData = [
  {
    name: "Miles",
    key: "range_in_mile",
    defaultValue: "0.25",
    options: [0.25, 0.5, 1],
  },
  {
    name: "Land",
    key: "land_sq_ft",
    defaultValue: "20000",
    options: [5000, 10000, 15000, 20000],
  },
  {
    name: "Building",
    key: "building_sq_ft",
    defaultValue: "2000",
    options: [500, 1000, 1500, 2000],
  },
  {
    name: "Age",
    key: "age",
    defaultValue: "40",
    options: [10, 20, 30, 40],
  },
];

const SortData = [
  {
    name: "Small Distance",
    key: "small_distance_mile_first",
  },
  {
    name: "Long Distance",
    key: "long_distance_mile_first",
  },
  {
    name: "Small Building Ratio",
    key: "small_building_ratio_first",
  },
  {
    name: "Large Building Ratio",
    key: "large_building_ratio_first",
  },
];

const Comparison = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const pageCount = searchParams.get("page")
    ? Number(searchParams.get("page")) > 0
      ? Number(searchParams.get("page"))
      : 1
    : 1;
  const [FilterStatusKey, setFilterStatusKey] = useState("city");
  const dispatch = useDispatch();
  const { propertiesList, propertyDetailsData } = useSelector(
    (state) => state.properties
  );
  const propertyDetailsDataFilter = new Set(propertyDetailsData);
  const propertyDetailsDataArray = Array.from(propertyDetailsDataFilter);

  const propertiesListFilter = new Set(propertiesList);
  const propertiesListArray = Array.from(propertiesListFilter);

  const [filterSate, setFilterSate] = useState({
    range_in_mile: "0.25",
    land_sq_ft: "20000",
    building_sq_ft: "2000",
    age: "40",
    sort_by: "small_building_ratio_first",
  });
  const [openMaps, setOpenMaps] = useState(false);
  const [
    getPropertiesComparison,
    { data: ComparisonProperties, isLoading, isError, error },
  ] = useGetPropertiesComparisonMutation();
  const [
    getListOfProperties,
    { data: listOfProperties, isLoading: listOfPropertiesLoading },
  ] = useGetListOfPropertiesMutation();

  const [
    getOneProperty,
    {
      data: oneProperty,
      isLoading: onePropertyLoading,
      isError: isOnePropertyError,
    },
  ] = useGetOnePropertyMutation();

  const AssessmentsComponent = () => (
    <div className="w-full">
      <div className="flex gap-4"></div>
      <div className="flex gap-4 w-full">
        <PropertyCard className="border" />
        {listOfPropertiesLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto scroll-right flex gap-4 w-full pb-2">
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
            <PropertyCard />
          </div>
        )}
      </div>
    </div>
  );

  const tapsData = [
    {
      name: "Assessments",
      key: "assessment",
      component: <AssessmentsComponent />,
    },
    { name: "Sales", key: "sales", component: <div>Sales</div> },
  ];

  const [activeTab, setActiveTab] = useState({
    name: "Assessments",
    key: "assessment",
    component: <AssessmentsComponent />,
  });

  const getListOfPropertiesHandler = async () => {
    await getListOfProperties({
      pins: propertiesListArray,
      comparable_property_pin: oneProperty.data.pin,
    });
  };

  useEffect(() => {
    getListOfPropertiesHandler();
  }, [propertiesListArray.length]);

  useEffect(() => {
    getOneProperty(id);
  }, [id]);

  useEffect(() => {
    if (oneProperty) {
      dispatch(clearPropertiesList());
      getPropertiesComparison({
        id: oneProperty.data.id,
        query: queryString.stringify({
          ...filterSate,
          page: pageCount,
          limit: 50,
        }),
      });
    }
  }, [oneProperty, pageCount, filterSate]);

  return (
    <>
      {openMaps ? (
        <Maps
          openMaps={openMaps}
          setOpenMaps={setOpenMaps}
          oneProperty={oneProperty}
          listOfProperties={listOfProperties}
          listOfPropertiesLoading={listOfPropertiesLoading}
          onePropertyLoading={onePropertyLoading}
        />
      ) : (
        <div className="p-4 flex flex-col gap-8">
          <div className="flex gap-8 justify-between">
            <div className="flex gap-6 items-center ">
              <div className="flex gap-6">
                {tapsData.map((item) => (
                  <button
                    key={item.key}
                    className={`text-heading_3  border-b-2  ${
                      item.key === activeTab.key
                        ? "border-primary text-primary"
                        : "border-white text-[#054985]"
                    }`}
                    onClick={() => setActiveTab(item)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="border bg-primary h-[48px] rounded-[40px] flex gap-4 px-2 py-1">
                {FilterStatusData.map((item) => (
                  <Select
                    key={item.key}
                    onValueChange={(e) =>
                      setFilterSate({ ...filterSate, [item.key]: e })
                    }
                  >
                    <SelectTrigger
                      className={`flex items-center gap-1 rounded-[20px] border-primary p-1 text-body bg-primary text-white`}
                      onClick={() => {
                        alert(item.key);
                        setFilterStatusKey(item.key);
                      }}
                    >
                      <SelectValue placeholder={item.defaultValue} />
                      <span>{item.name}</span>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {item.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </div>
            <SearchProperties goToComparison />
          </div>
          {isOnePropertyError ? (
            <div className="text-center">Error, something went wrong</div>
          ) : (
            <>
              <div className="flex gap-6">
                <div className="w-full">
                  <div className="flex gap-4 justify-end items-center mb-2">
                    <p className="text-heading_3 text-[#054985]">View On Map</p>
                    <Switch toggle={openMaps} setToggle={setOpenMaps} />
                  </div>
                  <div className="flex gap-4 w-full h-[238px]">
                    {onePropertyLoading ? (
                      <Loader />
                    ) : (
                      oneProperty && (
                        <PropertyCard
                          className="border"
                          property={oneProperty.data}
                          hasDelete={false}
                        />
                      )
                    )}

                    {listOfPropertiesLoading ? (
                      <Loader />
                    ) : (
                      <div className="overflow-x-auto scroll-right scroll-property flex gap-4 w-full pb-2">
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
                              key={item.id}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex justify-between px-2 items-center relative`}
              >
                <div className="flex gap-6">
                  <div className="">
                    <Select
                      onValueChange={(e) =>
                        setFilterSate({ ...filterSate, sort_by: e })
                      }
                      className=""
                    >
                      <SelectTrigger
                        className={`!px-4 flex items-center gap-1 rounded-[8px] border  p-1 text-body bg-white text-dark`}
                      >
                        <span>Sort By :</span>
                        <SelectValue placeholder="Small Building Ratio" />
                        {/* <span>{item.name}</span> */}
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {SortData.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <p
                    className={`flex gap-2 border-l-[3px] pl-2 border-primary `}
                  >
                    <span className="leading-[45px]">Total Saving </span>
                    <span className="text-[30px] leading-[45px] font-bold">
                      {listOfProperties
                        ? `$${formattedNumber(listOfProperties.saves)}`
                        : ""}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  {oneProperty && (
                    <NewAppeals
                      defaultProperty={oneProperty?.data}
                      buttonClassName="!bg-white !text-dark !border-primary border"
                      hasIcon={false}
                      textButton="Appeals"
                      fillByAPI={true}
                    />
                  )}
                  {/* <FileReportPDF mainPin={id} pins={propertiesListArray} /> */}
                  <FileReportPDF2 mainPin={id} pins={propertiesListArray} />
                </div>
              </div>

              {isLoading ? (
                <Loader />
              ) : isError ? (
                <p>{error.data.detail ? "No results found" : "Error"}</p>
              ) : (
                ComparisonProperties && (
                  <>
                    <ComparisonTable
                      columns={
                        activeTab.key == "sales"
                          ? comparisonSalesColumns
                          : comparisonAssessmentsColumns
                      }
                      data={ComparisonProperties.data}
                      hasPagination={true}
                    />
                    <PropertySheet />
                  </>
                )
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Comparison;
