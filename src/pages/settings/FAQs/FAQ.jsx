import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const FAQ = ({ faq, setSelectedDeleteFAQ, setSelectedEditFAQ }) => {
  const [answerVisible, setAnswerVisible] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  useEffect(() => {
    if (isExpanded) {
      setAnswerVisible(faq.answer);
    } else {
      setAnswerVisible(
        faq.answer.substring(0, 100) + (faq.answer.length > 100 ? "..." : "")
      );
    }
  }, [faq, isExpanded]);

  return (
    <div className="p-6 rounded-[16px] border">
      <div className="flex justify-between items-center mb-4">
        <Link
          to={`/settings/faqs/${faq.id}`}
          className="text-heading_2 hover:underline"
        >
          {faq.question}
        </Link>
        <div className="flex gap-2">
          <button
            className="bg-[#F60000] text-white px-4 py-2 rounded-[8px]"
            onClick={() => setSelectedDeleteFAQ(faq)}
          >
            Delete
          </button>
          <button
            className={`px-4 py-2 rounded-[8px] ml-3 cursor-pointer bg-[#1A73E833] text-[#2C3E50]`}
            onClick={() => setSelectedEditFAQ(faq)}
          >
            Edit
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text text-opacity-50 text-[15px] font-[400]">
          {/* {faq.answer} */}
          {answerVisible}
          <span
            onClick={() => setIsExpanded(!isExpanded)}
            className="underline text-primary px-2 cursor-pointer"
          >
            {isExpanded
              ? "Show Less"
              : faq.answer.length > 100
                ? "Read More"
                : ""}
          </span>
        </p>

        {/* <button className="text-[16px] underline">Read More</button> */}
      </div>
    </div>
  );
};

export default FAQ;
