import { useEffect } from "react";
import SearchPropertiesComponent from "../SearchProperties";
import { useParams } from "react-router-dom";
import { useGetOnePropertyMutation } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import Details from "../Details";
import PropertyAnalysis from "../PropertyAnalysis";
import { formattedNumber } from "@/utiles/formattedNumber";

const Property = () => {
  const { id } = useParams();
  const [getOneProperty, { data, isLoading, isError }] =
    useGetOnePropertyMutation({ fixedCacheKey: id });

  useEffect(() => {
    async function fetchData() {
      await getOneProperty(id);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-[8px] m-4 p-4 bg-[#FCFCFC]">
        <div className="flex justify-between items-center">
          <SearchPropertiesComponent />
        </div>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p>Eroor</p>
        ) : (
          data && (
            <>
              <div className="flex justify-between flex-1 gap-4 md:flex-row flex-col">
                <div className="card bg-white shadow-custom w-full rounded-[8px] p-4 flex flex-col gap-2">
                  <div>
                    <p className="text-heading_2">Current Year </p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-body text-[#054985]">Current Year </p>
                      <p className="text-body">
                        $ {formattedNumber(data.data.current_year.market_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body text-[#054985]">Assessment</p>
                      <p className="text-body">
                        {" "}
                        $ {formattedNumber(data.data.current_year.assessment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body text-[#054985]">Taxes</p>
                      <p className="text-body">
                        {" "}
                        $ {formattedNumber(data.data.current_year.taxes)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-white shadow-custom w-full rounded-[8px] p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-heading_2">Prior Year </p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-body text-[#054985]">Current Year </p>
                      <p className="text-body">
                        {" "}
                        $ {formattedNumber(data.data.prior_year.market_value)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body text-[#054985]">Assessment</p>
                      <p className="text-body">
                        {" "}
                        $ {formattedNumber(data.data.prior_year.assessment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body text-[#054985]">Taxes</p>
                      <p className="text-body">
                        {" "}
                        $ {formattedNumber(data.data.prior_year.taxes)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-white shadow-custom w-full rounded-[8px] p-4 flex flex-col gap-3">
                  <div>
                    <p className="text-heading_2">Fair Value</p>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-body text-[#054985]">Current Year </p>
                      <p className="text-body">
                        $ {formattedNumber(data.data.fair_value.current_year)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body text-[#054985]">Assessment</p>
                      <p className="text-body">
                        $ {formattedNumber(data.data.fair_value.assessment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-body text-[#054985]">Taxes</p>
                      <p className="text-body">
                        $ {formattedNumber(data.data.fair_value.taxes)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <PropertyAnalysis property={data} />

              <Details data={data.data} />
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Property;
