import { formatePin } from "@/utiles/formatePin";
import { Pin } from "lucide-react";
import { Link } from "react-router-dom";
import PropertyImageSlider from "../Properties/PropertyImageSlider";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";

const Properties = ({ data }) => {
  return (
    <>
      <Swiper className={`w-full h-full `} spaceBetween={20} slidesPerView={1}>
        {data.map((item) => (
          <>
            <SwiperSlide key={item.pin}>
              <div className="p-1">
                <div
                  className={`relative p-4 rounded-[16px] h-full md:min-w-[262px] md:max-w-[380px] flex flex-col gap-4 shadow-custom `}
                >
                  <div className={`relative md:w-[350px] h-[210px]`}>
                    <PropertyImageSlider
                      defaultImages={item.default_image}
                      pin={item.pin}
                      replaceImageAction={false}
                    />
                  </div>
                  <Link to={`/properties/${item.pin}`}>
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
                  </Link>

                  {/* <Link
                  to={`/properties/${item.pin}`}
                  className="absolute w-full h-full top-0 left-0"
                ></Link> */}
                </div>
              </div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </>
  );
};

Properties.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      pin: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      default_image: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default Properties;
