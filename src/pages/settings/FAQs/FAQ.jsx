import React from "react";

const FAQ = ({ faq, setSelectedDeleteFAQ, setSelectedEditFAQ }) => {
  return (
    <div className="p-6 rounded-[16px] border">
      <div className="flex justify-between items-center mb-4">
        <p className="text-heading_2">{faq.question}</p>
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
      <div className="flex">
        <p className="text text-opacity-50 text-[15px] font-[400]">
          {faq.answer}
        </p>

        {/*  <button className="text-[16px] underline">Read More</button> */}
      </div>
    </div>
  );
};

export default FAQ;
