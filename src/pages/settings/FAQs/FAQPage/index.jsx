import AnswerIcon from "@/assets/Icons/AnswerIcon";
import QuestionIcon from "@/assets/Icons/QuestionIcon";
import BlogDescription from "@/components/BlogDescription";
import { useGetOneFAQQuery } from "@/redux/apiSlice";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

const FAQPage = () => {
  const { id } = useParams();
  const { data: faqData, isLoading, isError } = useGetOneFAQQuery(id);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  if (isError) return <div className="text-red-500">Error loading FAQ</div>;

  return (
    <div className="w-full bg-[#CFDDE0] flex justify-center py-14 min-h-[calc(100vh-150px)]">
      <div className="max-w-[calc(100%-32px)] md:max-w-[calc(100%-64px)] w-full border bg-white p-6 rounded-[20px] shadow-lg">
        <div className="flex items-center justify-between  md:px-8 mb-8">
          <div className="flex w-full col-span-1 flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-[20px] md:text-[26px] font-[700] text-[#181A20] flex-1">
                {faqData.data.title}
              </h1>
            </div>
            <div className="flex justify-between">
              <h1 className="text-[20px] md:text-[24px] font-[700] text-[#181A20] flex-1">
                {faqData.data.question}
              </h1>
              <QuestionIcon />
            </div>
            <div className="flex justify-between">
              <div className="flex-1">
                <BlogDescription
                  description={faqData.data.answer}
                  renameLinks={faqData.data.rename_links || []}
                />
              </div>
              <AnswerIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
