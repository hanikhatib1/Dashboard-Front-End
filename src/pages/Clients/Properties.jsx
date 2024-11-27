import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatePin } from "@/utiles/formatePin";
import { Pin } from "lucide-react";
import { Link } from "react-router-dom";
const Properties = ({ data }) => {
  return (
    <Carousel className="max-w-[380px] h-[350px] !bg-white" hideArrows>
      <CarouselContent className="!bg-white !shadow-none">
        {data.map((item, index) => (
          <CarouselItem
            key={index}
            className="!w-[300px] h-[350px] !bg-white !shadow-none "
          >
            <div className="p-1">
              <div
                className={`relative p-4 rounded-[16px] h-full min-w-[262px] max-w-[380px] flex flex-col gap-4 shadow-custom `}
              >
                <div className={`relative w-[350px] h-[210px]`}>
                  <img
                    src={item.default_image}
                    alt=""
                    className="absolute w-full h-full object-cover rounded-[8px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="flex gap-1 items-center">
                    <Pin
                      className="w-[20px]  h-[20px] rotate-[45deg] "
                      color="#80838E"
                    />
                    <span className="text-dark text-[24px] text-bold">
                      {formatePin(item.pin)}
                    </span>
                  </p>
                  <p className="text-[18px] font-medium text-[#80838E]">
                    {item.address}
                  </p>
                </div>
                <Link
                  to={`/properties/${item.pin}`}
                  className="absolute w-full h-full top-0 left-0"
                ></Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default Properties;
