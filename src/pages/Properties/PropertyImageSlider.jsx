import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ReplacedImage from "@/components/ReplacedImage";
import PropTypes from "prop-types";
import "swiper/css";
import "swiper/css/pagination";

const PropertyImageSlider = ({
  replaceImageAction = true,
  defaultImages,
  pin,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      swiperRef.current.navigation
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;

      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <Swiper
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={() => console.log("slide change")}
        className="h-full z-0"
        nested={true}
      >
        {defaultImages.map((image, index) => (
          <SwiperSlide key={index} className="h-full">
            <ReplacedImage
              pickedImage={image}
              defaultImage={image}
              replaceImageAction={replaceImageAction}
              pin={pin}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

PropertyImageSlider.propTypes = {
  replaceImageAction: PropTypes.bool,
  defaultImages: PropTypes.arrayOf(PropTypes.string).isRequired,
  pin: PropTypes.string.isRequired,
};

export default PropertyImageSlider;
