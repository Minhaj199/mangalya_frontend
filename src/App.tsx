import React, { useContext, lazy, Suspense } from "react";

const Login = lazy(() => import("./admin/login/Login"));
import { Layout } from "./admin/layout/Layout";
import { Routes, Route } from "react-router-dom";
import Landing from "./userPages/landing/Landing";


import { SignupContext } from "./shared/globalCondext/signupData";

const LoginLanding = lazy(() => import("./userPages/loginLanding/LogLanding"));
const UserTable = lazy(() => import("./admin/pages/userMgt/Table"));
const OTPVerification = lazy(
  () => import("./userPages/otpVerification/OTPVerification")
);
const PlanDetails = lazy(() => import("./admin/pages/planMgt/PlanMgt"));
import {
  ProtectRouteAdmin,
  PlanRouteUser,
  UnProtectRouteUser,
  UnProtectRouteAdmin,
  ProtectRouteUser,
} from "./shared/hoc/routeManagement";
import CircularIndeterminate from "./components/circularLoading/Circular";
const AddPlan = lazy(() => import("./admin/pages/addPlan/AddPlan"));
const SubscriberTable = lazy(() => import("./admin/pages/subscribers/Table"));
const PlanPurchase = lazy(() => import("./userPages/plan/Plan"));
const UserProfile = lazy(() => import("./userPages/userProfile/UserProfile"));
const Credentials = lazy(() => import("./userPages/signup/Credentials"));
const UserSearchPage = lazy(() => import("./userPages/search/Search"));
const Matched = lazy(() => import("./userPages/matchedProfile/Matched"));
const Abuse = lazy(() => import("./admin/pages/abuse/Abuse"));
const Dash = lazy(() => import("./admin/pages/dash/Dash"));
const ChatInterface = lazy(() => import("./userPages/chatPage/ChatPag"));
const PlanHistoryAndReq = lazy(
  () => import("./userPages/planHistory/PlanHistoryAndReq")
);

export const districtsOfKerala = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Trivandrum",
  "Thrissur",
  "Wayanad",
];

const App: React.FC = () => {
  const context = useContext(SignupContext);

  if (!context) {
    throw new Error("user  data is empty in opt verification");
  }

  const inputFields = [
    { linkingName: "firstName", inputType: "text", inputName: "FIRST NAME" },
    { linkingName: "secondName", inputType: "text", inputName: "SECOND NAME" },
    {
      linkingName: "dateOfBirth",
      inputType: "date",
      inputName: "DATE OF BIRTH",
    },
    {
      linkingName: "state",
      inputType: "dropDown",
      option: districtsOfKerala,
      inputName: "DISTRICT THAT YOU LIVE",
    },
    {
      linkingName: "Gender",
      inputType: "dropDown",
      option: ["female", "male"],
      inputName: "YOUR GENDER",
    },
    {
      linkingName: "partner",
      inputType: "dropDown",
      option: ["male", "female"],
      inputName: "GENDER OF PARTNER",
    },
    { linkingName: "email", inputType: "email", inputName: "EMAIL" },
    { linkingName: "password", inputType: "text", inputName: "PASSWORD" },
    {
      linkingName: "cPassword",
      inputType: "password",
      inputName: "CONFIRM PASSWORD",
    },
  ];
  return (
    <Suspense
      fallback={
        <div className="w-full h-full fixed flex justify-center items-center bg-black">
          <CircularIndeterminate />
        </div>
      }
    >
      <Routes>
        <Route element={<UnProtectRouteAdmin />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectRouteAdmin />}>
          <Route path="/admin" element={<Layout />}>
            <Route path="manageUser" element={<UserTable />} />
            <Route path="addPlan" element={<AddPlan />} />
            <Route path="Plan" element={<PlanDetails />} />
            <Route path="subscriber" element={<SubscriberTable />} />
            <Route path="Dash" element={<Dash />} />
            <Route path="Abuse" element={<Abuse />} />
          </Route>
        </Route>
        <Route path="/PlanDetails" element={<PlanRouteUser />}>
          <Route path="" element={<PlanPurchase />} />
        </Route>
        <Route element={<UnProtectRouteUser />}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/signUp"
            element={<Credentials inputFields={inputFields} toggle={1} />}
          />
          <Route
            path="/photoAdding"
            element={<Credentials inputFields={inputFields} toggle={2} />}
          />
          <Route path="/otpVerification" element={<OTPVerification />} />
        </Route>
        <Route element={<ProtectRouteUser />}>
          <Route path="/loginLanding" element={<LoginLanding />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/suggestion" element={<LoginLanding />} />
          <Route path="/search" element={<UserSearchPage />} />
          <Route path="/match" element={<Matched />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/planAndRequest" element={<PlanHistoryAndReq />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
