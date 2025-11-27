import { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import {
  setPageCountStore,
  setPropertiesList,
} from "@/redux/features/Properties";
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
import FileReportPDF3 from "@/components/FileReportPDF3";
import CombinedPDFReportModel from "@/components/CombinedPDFReportModel";

const mails = {
  name: "Miles",
  key: "range_in_mile",
  defaultValue: "0.25",
  options: [0.25, 0.5, 1],
  type: "select",
};

const FilterStatusData = [
  {
    name: "Miles",
    key: "range_in_mile",
    defaultValue: "0.25",
    defaultKey: "0.25", //0.25, 0.5, 1
    options: [
      {
        key: "0.25",
        value: "0.25",
      },
      {
        key: "0.5",
        value: "0.5",
      },
      {
        key: "1",
        value: "1",
      },
    ],
    type: "select",
  },
  {
    name: "Land",
    key: "land_sq_ft",
    defaultValue: "200", //50, 100, 150, 200, 250
    defaultKey: "+- 200 %",
    options: [
      {
        key: "+- 50 %",
        value: "50",
      },
      {
        key: "+- 100 %",
        value: "100",
      },
      {
        key: "+- 150 %",
        value: "150",
      },
      {
        key: "+- 200 %",
        value: "200",
      },
      {
        key: "+- 250 %",
        value: "250",
      },
    ],
    type: "select",
  },
  {
    name: "Building",
    key: "building_sq_ft",
    defaultValue: "20", //5, 10, 15, 20, 25
    defaultKey: "+- 20 %",
    options: [
      {
        key: "+- 5 %",
        value: "5",
      },
      {
        key: "+- 10 %",
        value: "10",
      },
      {
        key: "+- 15 %",
        value: "15",
      },
      {
        key: "+- 20 %",
        value: "20",
      },
      {
        key: "+- 25 %",
        value: "25",
      },
    ],
    type: "select",
  },
  {
    name: "Age",
    key: "age",
    defaultValue: "20", //10, 20, 30, 40
    defaultKey: "+- 20 Years",
    options: [
      {
        key: "+- 10 Years",
        value: "10",
      },
      {
        key: "+- 20 Years",
        value: "20",
      },
      {
        key: "+- 30 Years",
        value: "30",
      },
      {
        key: "+- 40 Years",
        value: "40",
      },
    ],
    type: "select",
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
  {
    name: "Large Building Size",
    key: "large_building_size",
  },
  {
    name: "Small Building Size",
    key: "small_building_size",
  },
  {
    name: "High Score",
    key: "hight_score",
  },
  {
    name: "Low Score",
    key: "low_score",
  },
];

const Comparison = () => {
  const { id } = useParams();
  const [pageCount, setPageCount] = useState(1);
  const [FilterStatusKey, setFilterStatusKey] = useState("city");
  const [exterior, setExterior] = useState(false);
  const dispatch = useDispatch();
  const [selectedProperties, setSelectedProperties] = useState([]);
  const { propertiesList, propertyDetailsData } = useSelector(
    (state) => state.properties
  );

  const [filterSate, setFilterSate] = useState({
    range_in_mile: "0.25",
    land_sq_ft: "200",
    building_sq_ft: "20",
    age: "20",
    sort_by: "small_building_ratio_first",
    by_distance_only: false,
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
      isSuccess: isOnePropertySuccess,
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

  const getListOfPropertiesHandler = async (defaultPins) => {
    await getListOfProperties({
      pins: defaultPins ? defaultPins : selectedProperties,
      comparable_property_pin: oneProperty.data.pin,
    });
  };

  useEffect(() => {
    getListOfPropertiesHandler();
  }, [selectedProperties?.length]);

  useEffect(() => {
    if (oneProperty?.data?.compatrbles?.length > 0) {
      //getListOfPropertiesHandler(oneProperty?.data.compatrbles);
      //setSelectedProperties(oneProperty?.data.compatrbles)
      dispatch(setPropertiesList(oneProperty?.data.compatrbles));
    }
  }, [oneProperty?.data.compatrbles]);

  useEffect(() => {
    getOneProperty(id);
  }, [id]);

  useEffect(() => {
    if (oneProperty) {
      //dispatch(clearPropertiesList());
      //setPageCount(1);
      getPropertiesComparison({
        id: oneProperty.data.id,
        query: queryString.stringify({
          ...filterSate,
          page: pageCount,
          limit: 50,
          exterior: exterior,
        }),
      });
    }
    if (pageCount) {
      dispatch(setPageCountStore(pageCount));
    }
  }, [oneProperty, filterSate, exterior, pageCount]);

  /* useEffect(() => {
    if (oneProperty) {
      getPropertiesComparison({
        id: oneProperty.data.id,
        query: queryString.stringify({
          ...filterSate,
          page: pageCount,
          limit: 50,
        }),
      });
    }
    if (pageCount) {
      dispatch(setPageCountStore(pageCount));
    }
  }, [oneProperty, pageCount]); */

  useEffect(() => {
    const propertiesListFilter = new Set(propertiesList);
    const propertiesListArray = Array.from(propertiesListFilter);

    setSelectedProperties((prev) => {
      const filter2 = Array.from(new Set([...propertiesListArray]));
      return filter2;
    });
  }, [propertiesList]);

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
          <div className="flex gap-8 justify-between flex-col ">
            <div className="flex justify-between flex-col-reverse md:flex-row gap-4 w-full">
              <div className="flex gap-6 items-center flex-col md:flex-row ">
                <div className="flex gap-6 self-start">
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
              </div>
              <SearchProperties goToComparison />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-4 justify-between flex-col md:flex-row w-max">
                <div
                  className={` bg-primary h-[32px] rounded-[40px] w-max flex items-center gap-4 px-2 py-1  ${!filterSate.by_distance_only ? "bg-opacity-75" : ""}`}
                >
                  <input
                    type="radio"
                    name="radio"
                    value="true"
                    checked={filterSate.by_distance_only === true}
                    onChange={(e) =>
                      setFilterSate((prev) => ({
                        ...prev,
                        by_distance_only: true,
                      }))
                    }
                  />
                  <Select
                    onValueChange={(e) =>
                      setFilterSate({ ...filterSate, [mails.key]: e })
                    }
                  >
                    <SelectTrigger
                      className={`flex items-center gap-1 rounded-[20px]  p-1 text-body  ${!filterSate.by_distance_only ? "bg-opacity-75 border-none" : "bg-primary border-primary"} text-white h-[24px]`}
                      onClick={() => {
                        setFilterStatusKey(mails.key);
                      }}
                    >
                      <SelectValue placeholder={mails.defaultValue} />
                      <span>{mails.name}</span>
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        {mails.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className={`border w-full justify-start self-start bg-primary min-h-[32px] rounded-[12px] md:rounded-[40px] flex flex-row items-center gap-1 md:gap-4 px-2 py-1 ${filterSate.by_distance_only ? "bg-opacity-75" : ""}`}
                >
                  <input
                    type="radio"
                    name="radio"
                    value="false"
                    checked={filterSate.by_distance_only === false}
                    onChange={(e) => {
                      setFilterSate((prev) => ({
                        ...prev,
                        by_distance_only: false,
                      }));
                    }}
                  />
                  {FilterStatusData.map((item, index) => (
                    <Select
                      key={item.key}
                      onValueChange={(e) =>
                        setFilterSate({ ...filterSate, [item.key]: e })
                      }
                    >
                      <SelectTrigger
                        className={`flex items-center gap-0 md:gap-1 flex-1 rounded-[20px] w-max p-0 md:p-1 text-body  ${filterSate.by_distance_only ? "bg-opacity-75 border-none" : "bg-primary border-primary"} text-white h-[24px]`}
                        onClick={() => {
                          setFilterStatusKey(item.key);
                        }}
                      >
                        <SelectValue placeholder={item.defaultKey} />
                        <span className="text-[10px]">{item.name}</span>
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {item.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.key}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>
              <div className="w-max">
                <Select
                  onValueChange={(e) => setExterior(e)}
                  className=""
                  defaultValue={exterior ? "true" : "false"}
                >
                  <SelectTrigger
                    className={`!px-4 flex items-center gap-1 rounded-[8px] border  p-1 text-body bg-white text-dark`}
                  >
                    <span>Exterior :</span>
                    <SelectValue placeholder={exterior ? "Yes" : "No"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value={true}>Yes</SelectItem>
                      <SelectItem value={false}>No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
                  <div className="flex gap-4 w-full h-max md:h-[238px] flex-col md:flex-row">
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
                      <div className="overflow-x-auto h-[238px] scroll-right scroll-property flex gap-4 w-full pb-2">
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
                className={`flex flex-col gap-3 w-full justify-between px-2  relative`}
              >
                <div className="flex justify-between">
                  <div className="flex gap-6 w-max flex-1">
                    <Select
                      onValueChange={(e) =>
                        setFilterSate({ ...filterSate, sort_by: e })
                      }
                      className="!w-max"
                      defaultValue={filterSate.sort_by}
                    >
                      <SelectTrigger
                        className={`!px-4 w-max flex items-center gap-1 rounded-[8px]  p-1 text-body bg-white text-dark`}
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

                    {/*  {
    accessorKey: "assessed_value_comp",
    header: "Assessed Value",
  }, */}
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
                    <FileReportPDF3 mainPin={id} pins={selectedProperties} />
                    <CombinedPDFReportModel
                      mainPin={id}
                      pins={selectedProperties}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap flex-1 gap-2 h-max">
                  <p
                    className={`hidden gap-2 md:flex border-l-[3px] pl-2 border-primary w-max`}
                  >
                    <span className="leading-[30px] whitespace-nowrap">
                      Total Saving{" "}
                    </span>
                    <span className="text-[30px] leading-[30px] font-bold">
                      {listOfProperties
                        ? `$${formattedNumber(listOfProperties.saves)}`
                        : ""}
                    </span>
                  </p>
                  <p
                    className={`hidden gap-2 md:flex border-l-[3px] pl-2 border-primary w-max`}
                  >
                    <span className="leading-[30px] whitespace-nowrap">
                      Average Building Assessment{" "}
                    </span>
                    <span className="text-[30px] leading-[30px] font-bold">
                      {listOfProperties
                        ? `$${formattedNumber(listOfProperties.assessed_value_comp)}`
                        : ""}
                    </span>
                  </p>
                  <p
                    className={`hidden gap-2 md:flex border-l-[3px] pl-2 border-primary w-max`}
                  >
                    <span className="leading-[30px] whitespace-nowrap">
                      Assessed Value
                    </span>
                    <span className="text-[30px] leading-[30px] font-bold">
                      {listOfProperties
                        ? `$${formattedNumber(listOfProperties.building_avg_ass)}`
                        : ""}
                    </span>
                  </p>
                </div>
                <p
                  className={`flex md:hidden gap-2 self-center md:border-l-[3px] pl-2 border-primary `}
                >
                  <span className="leading-[45px]">Total Saving</span>
                  <span className="text-[30px] leading-[45px] font-bold">
                    {listOfProperties
                      ? `$${formattedNumber(listOfProperties.saves)}`
                      : ""}
                  </span>
                </p>
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
                      pagination={ComparisonProperties.pagination}
                      setPageCount={setPageCount}
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
