import { LoaderCircle } from "lucide-react";

const Loader = ({ className }) => {
  return (
    <div className={`${className} flex justify-center items-center w-full`}>
      <LoaderCircle className="animate-spin" />
    </div>
  );
};

export default Loader;
