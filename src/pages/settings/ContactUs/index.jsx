import { CircleEllipsis, MessageCircle, RotateCcw, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import ContactUsTable from "./ContactUsTable";
import {
  useGetAllContactUsMutation,
  useGetContactUsInfoQuery,
} from "@/redux/apiSlice";
import { columns } from "./tableData";
import Loader from "@/components/Loader";
import AddReplayModal from "./AddReplayModal";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";

const ContactUs = () => {
  const [searchText, setSearchText] = useState("");
  const { isLoading: contactUsInfoLoading, data: contactUsInfo } =
    useGetContactUsInfoQuery();
  const [getAllContactUs, { isLoading, isError, data }] =
    useGetAllContactUsMutation();
  const { replayContactData } = useSelector((state) => state.contactUs);

  useEffect(() => {
    async function fetchData() {
      await getAllContactUs(`search=${searchText}`);
    }
    fetchData();
  }, [searchText]);

  return (
    <div className="p-8 flex flex-col gap-8">
      {contactUsInfoLoading ? (
        <Loader />
      ) : (
        contactUsInfo && (
          <>
            <div className="flex gap-4 justify-between">
              <div className="flex gap-2 bg-white p-8 rounded-[16px] shadow-lg items-center w-[380px]">
                <i className=" rounded-full flex justify-center items-center">
                  {" "}
                  <MessageCircle size={50} color="#80838E" />
                </i>
                <div>
                  <p className="text-[24px] text-[#222222] leading-[30px] font-[700]">
                    {contactUsInfo.data.total_contact_us}
                  </p>
                  <p className="text-[20px] text-[#666666] leading-[30px] font-[500]">
                    Total Messages
                  </p>
                </div>
              </div>
              <div className="flex gap-2 bg-white p-8 rounded-[16px] shadow-lg items-center w-[380px]">
                <i className=" rounded-full flex justify-center items-center">
                  {" "}
                  <CircleEllipsis size={50} color="#80838E" />
                </i>
                <div>
                  <p className="text-[24px] text-[#222222] leading-[30px] font-[700]">
                    {contactUsInfo.data.total_not_replies}
                  </p>
                  <p className="text-[20px] text-[#666666] leading-[30px] font-[500]">
                    Pending Messages
                  </p>
                </div>
              </div>
              <div className="flex gap-2 bg-white p-8 rounded-[16px] shadow-lg items-center w-[380px]">
                <i className=" rounded-full flex justify-center items-center">
                  {" "}
                  <RotateCcw size={50} color="#80838E" />
                </i>
                <div>
                  <p className="text-[24px] text-[#222222] leading-[30px] font-[700]">
                    {contactUsInfo.data.total_replies}
                  </p>
                  <p className="text-[20px] text-[#666666] leading-[30px] font-[500]">
                    Replied messages
                  </p>
                </div>
              </div>
            </div>
          </>
        )
      )}

      <div className="border rounded-[8px]">
        <div className="flex justify-between items-center p-3">
          <p>Contacts</p>
          <div className="rounded-[8px] overflow-hidden relative h-[40px] min-w-[400px] text-[#A1A1AA]">
            <Search
              className="absolute top-0 left-1 w-[20px] h-full z-10"
              color="#A1A1AA"
            />
            <Input
              type="Search"
              placeholder="Search Contact"
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none pl-[30px]  outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p>Error</p>
        ) : (
          data && <ContactUsTable data={data} columns={columns} />
        )}
      </div>
      {replayContactData && <AddReplayModal refetch={getAllContactUs} />}
    </div>
  );
};

export default ContactUs;
