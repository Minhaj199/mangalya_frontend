import { IEmailForGotContextType, ISignupContextType, SignupFirst } from "@/types/typesAndInterfaces";
import React, { createContext, useState, ReactNode } from "react";

export const SignupContext = createContext<ISignupContextType | null>(null);
export const EmailForFogot = createContext<IEmailForGotContextType | null>(null);
interface SignupProvider {
  children: ReactNode;
}
export const SignupProvider = ({ children }: SignupProvider) => {
  const [signupFirstData, setSignupFirst] = useState<SignupFirst>({
    "FIRST NAME": "",
    "SECOND NAME": "",
    "DATE OF BIRTH": "",
    "GENDER OF PARTNER": "",
    "DISTRICT THAT YOU LIVE": "",
    "YOUR GENDER": "",
    EMAIL: "",
    PASSWORD: "",
  });
  const [forgotEmail, setforgotEmail] = useState<string>("");
  return (
    <EmailForFogot.Provider value={{ forgotEmail, setforgotEmail }}>
      <SignupContext.Provider value={{ signupFirstData, setSignupFirst }}>
        {children}
      </SignupContext.Provider>
    </EmailForFogot.Provider>
  );
};
