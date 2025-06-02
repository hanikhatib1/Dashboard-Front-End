import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import PropertyCard from "./PropertyCard";
import { Pin } from "lucide-react";
import { formatePin } from "@/utiles/formatePin";
import PropertiesTable from "../Details/Table";
import { descriptionColumns } from "../Details/TablesData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { setPropertyDetails } from "@/redux/features/Properties";
import ReplacedImage from "@/components/ReplacedImage";
import PropertyImageSlider from "../PropertyImageSlider";
const formateDescription = (description) =>
  Object.keys(description).map((key) => ({ key, value: description[key] }));

export default function PropertySheet() {
  const { propertyDetails } = useSelector((state) => state.properties);
  const dispatch = useDispatch();
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [propertyDetails]);

  return (
    <Sheet
      open={propertyDetails}
      onOpenChange={() => dispatch(setPropertyDetails(null))}
    >
      {propertyDetails && (
        <SheetContent
          ref={contentRef}
          className="bg-white max-w-[530px] md:min-w-[530px] min-w-max overflow-y-auto"
        >
          <div className="grid gap-4 py-4">
            <div
              className={`bg-white p-4 rounded-[16px] h-[343px] min-w-[262px] flex flex-col gap-2 shadow-custom `}
            >
              <div className="w-full relative h-[240px]">
                {/* <ReplacedImage
                  pin={propertyDetails.pin}
                  defaultImage={propertyDetails?.default_image}
                  pickedImage={propertyDetails?.picked_image}
                /> */}
                <PropertyImageSlider
                  defaultImages={propertyDetails.default_image}
                  pin={propertyDetails.pin}
                />
              </div>
              <div>
                <p className="flex gap-1">
                  <Pin
                    className="w-[20px]  h-[20px] rotate-[45deg]"
                    color="#80838E"
                  />
                  <span className="text-[#53ABF9] text-heading_3">
                    {formatePin(propertyDetails.pin)}
                  </span>
                </p>
                <p className="heading_2">{propertyDetails.property_address}</p>
              </div>
            </div>
          </div>
          <div>
            <PropertiesTable
              columns={descriptionColumns}
              data={[...formateDescription(propertyDetails.description)]}
              hasPagination={false}
              showHeadTable={false}
            />
          </div>
        </SheetContent>
      )}
    </Sheet>
  );
}
