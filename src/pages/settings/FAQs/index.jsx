import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect } from "react";
import AddNewFAQ from "./AddNewFAQ";
import FAQ from "./FAQ";
import { useGetAllFAQsQuery } from "@/redux/apiSlice";
import Loader from "@/components/Loader";
import DeleteFAQModel from "./DeleteFAQModel";
import EditFAQModel from "./EditFAQModel";
import Pagination from "@/components/Pagination";

const FAQs = () => {
  const [page, setPage] = React.useState(1);
  const [searchText, setSearchText] = React.useState("");
  const [selectedDeleteFAQ, setSelectedDeleteFAQ] = React.useState(null);
  const [selectedEditFAQ, setSelectedEditFAQ] = React.useState(null);
  const { data, isFetching, isLoading, isError, refetch } = useGetAllFAQsQuery(
    `search=${searchText}&sort=sort&limit=2&page=${page}`
  );

  useEffect(() => {
    if (searchText) {
      refetch(`search=${searchText}&sort=sort&limit=20&page=${page}`);
    }
    window.scrollTo(0, {
      top: 0,
      behavior: "smooth",
    });
  }, [searchText, refetch, page]);

  if (isLoading) return <Loader />;
  if (isError) return <p>Error</p>;

  return (
    <div className="p-8 flex flex-col gap-7">
      <div className="flex justify-between items-center">
        <div className="rounded-[8px] overflow-hidden relative h-[40px] w-[50%] md:min-w-[400px] text-[#A1A1AA] border">
          <Search
            className="absolute top-0 left-1 w-[20px] h-full z-10"
            color="#A1A1AA"
          />
          <Input
            type="Search"
            placeholder="Search by Question.."
            onChange={(e) => setSearchText(e.target.value)}
            className="border-none pl-[30px] bg-[#FCFCFC] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
          />
        </div>
        <div className="flex gap-2">
          <AddNewFAQ refetch={refetch} />
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-6 min-h-[40vh]">
          {data &&
            data.data.map((faq) => (
              <FAQ
                key={faq.id}
                faq={faq}
                setSelectedDeleteFAQ={setSelectedDeleteFAQ}
                setSelectedEditFAQ={setSelectedEditFAQ}
              />
            ))}
          {/* Placeholder FAQs for demonstration */}
        </div>
      )}
      {data && (
        <Pagination
          page={data.pagination.page}
          setPage={setPage}
          total_pages={data.pagination.total_pages}
        />
      )}
      {selectedDeleteFAQ && (
        <DeleteFAQModel
          setSelectedDeleteFAQ={setSelectedDeleteFAQ}
          faq={selectedDeleteFAQ}
          refetch={refetch}
        />
      )}
      {selectedEditFAQ && (
        <EditFAQModel
          refetch={refetch}
          faq={selectedEditFAQ}
          setSelectedEditFAQ={setSelectedEditFAQ}
        />
      )}
    </div>
  );
};

export default FAQs;
