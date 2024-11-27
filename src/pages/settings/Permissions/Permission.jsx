import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  useAddPermissionMutation,
  useGetConstantsQuery,
  useGetOnePermissionMutation,
  useUpdatedPermissionsMutation,
} from "@/redux/apiSlice";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PermissionCategory = {
  0: "Add Permissions",
  1: "Edit Permissions",
  2: "Delete Permissions",
};

const Permission = () => {
  const { id } = useParams();
  const [permissionDataMain, setPermissionDataMain] = useState(null);
  const [permissionDataFiltered, setPermissionDataFiltered] = useState(null);
  const [getOnePermission, { data: permissionData, isSuccess }] =
    useGetOnePermissionMutation();
  const { data: constants } = useGetConstantsQuery();
  const { toast } = useToast();
  const [updatedPermissions, { isLoading: updatedPermissionsLoading }] =
    useUpdatedPermissionsMutation();
  const [addPermission, { isLoading: addPermissionLoading }] =
    useAddPermissionMutation();
  const isActive = (permission) => {
    return (
      permissionDataFiltered.permissions.find((i) => i.name === permission)
        ?.status ?? false
    );
  };
  const handleChangePermission = (permission) => {
    let clonePermissionDataFiltered = { ...permissionDataFiltered };
    const permissionIndex = clonePermissionDataFiltered.permissions.findIndex(
      (i) => i.name === permission
    );

    if (permissionIndex !== -1) {
      const updatedPermissions = [...clonePermissionDataFiltered.permissions];
      updatedPermissions[permissionIndex] = {
        ...updatedPermissions[permissionIndex],
        status: !updatedPermissions[permissionIndex].status,
      };
      clonePermissionDataFiltered.permissions = updatedPermissions;
    } else {
      clonePermissionDataFiltered.permissions = [
        ...clonePermissionDataFiltered.permissions,
        {
          name: permission,
          status: true,
        },
      ];
    }
    setPermissionDataFiltered(clonePermissionDataFiltered);
  };

  const handleSaveChanges = async () => {
    if (id === "new") {
      const res = await addPermission(permissionDataFiltered);
      if ("data" in res) {
        setPermissionDataMain(permissionDataFiltered);
        return toast({
          title: "Success",
          description: "Permission added successfully",
          type: "success",
        });
      } else
        return toast({
          title: "Error",
          description: "Something went wrong",
          type: "error",
        });
    } else {
      const res = await updatedPermissions({
        id,
        body: permissionDataFiltered,
      });
      if ("data" in res) {
        setPermissionDataMain(permissionDataFiltered);
        return toast({
          title: "Success",
          description: "Permission updated successfully",
          type: "success",
        });
      } else
        return toast({
          title: "Error",
          description: "Something went wrong",
          type: "error",
        });
    }
  };

  useEffect(() => {
    if (id === "new") {
      setPermissionDataMain({
        name: "",
        permissions: [],
      });
      setPermissionDataFiltered({
        name: "",
        permissions: [],
      });
    } else getOnePermission(id);
  }, [id]);

  useEffect(() => {
    if (permissionData && id !== "new") {
      setPermissionDataMain(permissionData.data);
      setPermissionDataFiltered(permissionData.data);
    }
  }, [permissionData]);

  if (!isSuccess && id !== "new")
    return <div className="w-full h-[200px] text-center">Error</div>;

  return (
    <div className="p-4 flex flex-col gap-6 mb-8">
      <p className="text-heading_2 text-[#80838E]">
        {id === "new"
          ? "New Permission"
          : permissionData && `${permissionData.data.name} Permissions`}
      </p>
      <div className="flex flex-col justify-start items-start gap-3">
        <Label htmlFor="permissionsName">Permission Name</Label>
        <div className="rounded-[8px] overflow-hidden relative h-[40px] min-w-[400px] text-[#A1A1AA] border !bg-white">
          <Input
            id="permissionsName"
            type="text"
            placeholder="Search permission"
            value={permissionDataFiltered && permissionDataFiltered.name}
            onChange={(e) =>
              setPermissionDataFiltered((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="text-dark border-none outline-none focus:outline-offset-0 focus:outline-none absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <ul className="flex flex-col gap-6">
          {constants &&
            constants.permissions.map((item, index) => (
              <li
                key={index}
                className="border rounded-[8px] px-4 pt-2 pb-6 flex flex-col  gap-6"
              >
                <p className="text-heading_3">{PermissionCategory[index]}</p>

                <ul className="flex flex-wrap gap-4">
                  {item.map((permission, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Checkbox
                        checked={
                          permissionDataFiltered && isActive(permission.name)
                        }
                        className={`border-primary rounded-[4px] ${
                          permissionDataFiltered && isActive(permission.name)
                            ? "bg-primary text-white"
                            : ""
                        } `}
                        onCheckedChange={() =>
                          handleChangePermission(permission.name)
                        }
                      />
                      <label className="text-sm capitalize font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {permission.name.split("_").join(" ")}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          className="!bg-white text-primary rounded-[8px] border border-primary"
          onClick={() => setPermissionDataFiltered(permissionDataMain)}
        >
          Reset
        </Button>
        <Button
          className="bg-primary text-white rounded-[8px]"
          onClick={() => handleSaveChanges()}
        >
          {updatedPermissionsLoading || addPermissionLoading ? (
            <Loader />
          ) : null}
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Permission;
