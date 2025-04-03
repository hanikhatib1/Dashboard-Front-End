import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ImageCard = ({ imageReportData, setImageReportData }) => {
  return (
    <Dialog
      defaultOpen={imageReportData}
      open={imageReportData}
      onOpenChange={(open) => setImageReportData(open)}
    >
      <DialogContent className="sm:max-w-[800px] !p-0 !border-none h-[calc(100vh-20%)] bg-white !rounded-[8px] overflow-y-auto scroll-right">
        <div>
          <form className="flex flex-col gap-6 mb-8">
            <div className="p-4 flex flex-col gap-6">
              <p>Report Image</p>
              <div
                className={`w-full h-[400px] relative border ${imageReportData.image ? "" : "!bg-[#CCCDD2]"} bg-gray-100 overflow-hidden flex flex-col gap-2 flex-2`}
              >
                {imageReportData.image && (
                  <img
                    src={imageReportData.image}
                    alt=""
                    className="object-contain absolute top-0 left-0 w-full h-full"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 px-8">
              <div className="flex gap-4">
                <Button
                  className="bg-white text-primary rounded-[8px] border border-primary hover:text-white"
                  onClick={() => {
                    setImageReportData(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ImageCard.propTypes = {
  imageReportData: PropTypes.object,
  setImageReportData: PropTypes.func,
};

export default ImageCard;
