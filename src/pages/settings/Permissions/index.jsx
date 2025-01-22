import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { useGetPermissionsMutMutation } from "@/redux/apiSlice";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeletePermissionButton from "./DeletePermissionButton";

const Permissions = () => {
  const [searchText, setSearchText] = useState("");
  const [getPermissions, { isLoading, data, isError }] =
    useGetPermissionsMutMutation();

  useEffect(() => {
    getPermissions(searchText);
  }, [searchText]);

  return (
    <div className="p-4 flex flex-col gap-6">
      <p className="text-heading_2 text-[#80838E]">Group Permissions </p>
      <div className="flex justify-between items-center">
        <div className="rounded-[8px] overflow-hidden relative h-[40px] min-w-[400px] text-[#A1A1AA] border !bg-white">
          <Search
            className="absolute top-0 left-1 w-[20px] h-full z-10"
            color="#A1A1AA"
          />
          <Input
            type="Search"
            placeholder="Search permission"
            onChange={(e) => setSearchText(e.target.value)}
            className="border-none pl-[30px] outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
          />
        </div>
        <Link
          to="/settings/permissions/new"
          className="flex gap-2 items-center text-white rounded-[8px] bg-primary  px-4 py-2"
        >
          <Plus />
          <span>Add New Permission</span>
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <p className="text-heading_3 text-primary">Permission Name</p>
        {isLoading ? (
          <Loader className="flex-1" />
        ) : isError ? (
          <p>Error</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {data &&
              data.data.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b  items-center pb-2"
                >
                  <Link
                    to={`/settings/permissions/${item.id}`}
                    className="cursor-pointer"
                  >
                    {item.name}
                  </Link>
                  <div className="flex gap-2">
                    <Link
                      to={`/settings/permissions/${item.id}`}
                      className="flex gap-2 items-center text-white rounded-[8px] bg-primary  px-4 py-2"
                    >
                      Edit
                    </Link>
                    <DeletePermissionButton
                      id={item.id}
                      refetch={() => getPermissions(searchText)}
                    />
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Permissions;
