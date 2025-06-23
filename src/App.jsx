import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  appeals,
  auth,
  clients,
  dataScript,
  employees,
  homepage,
  invoices,
  properties,
  settings,
  township,
} from "./routes/paths";
import Layout from "./layout";
import Login from "./pages/auth/Login";
import Employees from "./pages/employees";
import NotFound from "./pages/NotFound";
import { useGetUserQuery } from "./redux/apiSlice";
import { useEffect } from "react";
import { login, logout } from "./redux/features/UserSlice";
import Loader from "./components/Loader";
import Client from "./pages/Clients";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Township from "./pages/township";
import Properties from "./pages/Properties";
import Property from "./pages/Properties/Property";
import Comparison from "./pages/Properties/Comparison/index.jsx";
import Permissions from "./pages/settings/Permissions";
import Permission from "./pages/settings/Permissions/Permission";
import DataScript from "./pages/DataScript";
import Appeals from "./pages/Appeals";
import AppealStatus from "./pages/settings/AppealStatus";
import ClientPage from "./pages/Clients/ClientPage";
import HomeTest from "./HomeTest";
import "react-datepicker/dist/react-datepicker.css";
import DataScriptActions from "./pages/DataScript/DataScriptActions";
import Invoices from "./pages/Invoices";
import Blogs from "./pages/settings/Blogs";
import Workers from "./pages/settings/Workers";
import ContactUs from "./pages/settings/ContactUs";
import Reports from "./pages/settings/Reports";
import Appeal from "./pages/Appeals/Appeal";
import FAQs from "./pages/settings/FAQs";

function App() {
  const { isSuccess, data, isError } = useGetUserQuery({});
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (isSuccess) dispatch(login(data.data));
    if (isError) dispatch(logout());
  }, [isSuccess, isError]);

  if (isLoading) return <Loader className="h-screen" />;

  return (
    <>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path={homepage.index} element={<HomeTest />} />

            <Route path={employees.index} element={<Employees />} />

            <Route path={clients.index} element={<Client />} />
            <Route path={clients.client} element={<ClientPage />} />

            <Route path={township.index} element={<Township />} />

            <Route path={properties.index} element={<Properties />} />
            <Route path={properties.property} element={<Property />} />
            <Route path={properties.comparison} element={<Comparison />} />

            <Route path={settings.permissions} element={<Permissions />} />
            <Route path={settings.permission} element={<Permission />} />
            <Route path={settings.appealStatus} element={<AppealStatus />} />
            <Route path={settings.blogs} element={<Blogs />} />
            <Route path={settings.workers} element={<Workers />} />
            <Route path={settings.contactUs} element={<ContactUs />} />
            <Route path={settings.reports} element={<Reports />} />
            <Route path={settings.faqs} element={<FAQs />} />

            <Route path={invoices.index} element={<Invoices />} />

            <Route
              path={dataScript.importDataScript}
              element={<DataScript />}
            />
            <Route path={dataScript.actions} element={<DataScriptActions />} />

            <Route path={appeals.index} element={<Appeals />} />
            <Route path={appeals.appeal} element={<Appeal />} />


            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path={auth.login} element={<Login />} />
          <Route path={auth.forgetPassword} element={<ForgetPassword />} />
          <Route path="*" element={<Navigate to={auth.login} />} />
        </Routes>
      )}
    </>
  );
}

export default App;
