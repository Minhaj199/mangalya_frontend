import React, { useContext } from "react";
import { Login } from "./admin/login/Login";
import { Layout } from "./admin/layout/Layout";
import { Routes, Route } from "react-router-dom";
import { Landing } from "./userPages/landing/Landing";
import { SignupContext } from "./shared/globalCondext/signupData";
import { LoginLanding } from "./userPages/loginLanding/LogLanding";
import { UserTable } from "./admin/pages/userMgt/Table";
import { OTPVerification } from "./userPages/otpVerification/OTPVerification";
import { PlanDetails } from "./admin/pages/planMgt/PlanMgt";
import {
  ProtectRouteAdmin,
  PlanRouteUser,
  UnProtectRouteUser,
  UnProtectRouteAdmin,
  ProtectRouteUser,
} from "./shared/hoc/routeManagement";
import { AddPlan } from "./admin/pages/addPlan/AddPlan";
import { SubscriberTable } from "./admin/pages/subscribers/Table";
import PlanPurchase from "./userPages/plan/Plan";
import { UserProfile } from "./userPages/userProfile/UserProfile";
import { Credentials } from "./userPages/signup/Credentials";
import { Dash } from "./admin/pages/dash/Dash";
import { UserSearchPage } from "./userPages/search/Search";
import { Matched } from "./userPages/matchedProfile/Matched";
import { Abuse } from "./admin/pages/abuse/Abuse";
import ChatInterface from "./userPages/chatPage/ChatPag";
import { PlanHistoryAndReq } from "./userPages/planHistory/PlanHistoryAndReq";

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
  );
};

export default App;
