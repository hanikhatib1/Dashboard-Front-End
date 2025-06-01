import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ReplacedImage from "@/components/ReplacedImage";
import { ChevronLeft } from "lucide-react";

const PropertyImageSlider = ({ replaceImageAction = false, defaultImages }) => {
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
      >
        {defaultImages.map((image, index) => (
          <SwiperSlide key={index} className="h-full">
            <ReplacedImage
              pickedImage={image}
              defaultImage={image}
              replaceImageAction={replaceImageAction}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertyImageSlider;
