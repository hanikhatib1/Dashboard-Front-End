import { useSelector } from "react-redux";

const usePermision = () => {
  const {
    user: { group_permission, role },
  } = useSelector((state) => state.user);
  const getValue = (val) => {
    group_permission.permissions.map((object) => {
      if (object.name === val) return object.status;
    });
  };

  const addAdmin = role === "super_admin" || getValue("add_admin");
  const deleteAdmin = role === "super_admin" || getValue("delete_admin");
  const editAdmin = role === "super_admin" || getValue("update_admin");
  const getAdmin = role === "super_admin" || getValue("get_admin");

  console.log(addAdmin, deleteAdmin, editAdmin, getAdmin);

  return { addAdmin, deleteAdmin, editAdmin, getAdmin };
};

export default usePermision;
