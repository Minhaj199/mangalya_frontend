//////////////admin related

import { Dispatch, SetStateAction } from "react";

export interface IAdminAuth {
  email: string;
  password: string;
}

export interface ILoginWarning {
  username: string;
  password: string;
}

export interface IAdminAuthicated {
  username?: string;
  adminVerified?: string;
  password?: string;
  token: string;
}


///////////////report abuser management///////

export interface IAbuserReport {
  _id: string;
  reporter: { _id: string; PersonalInfo: { firstName: string } };
  reported: { _id: string; PersonalInfo: { firstName: string } };
  read: boolean;
  reason: string;
  moreInfo: string;
  warningMail: boolean;
  rejected: boolean;
  block: boolean;
  createdAt: Date;
}

//////////////////// plan related/////////////

export type PlanMgtWarningType = {
  name: string;
  amount: string;
  connect: string;
  duration: string;
};
export type PlanDatas = {
  name: string;
  amount: number;
  connect: number;
  duration: number;
};
export type PlanType = {
  _id: string;
  name: string;
  delete: boolean;
  duration: number;
  features: string[];
  amount: number;
  connect: number;
};

export type PlanDataForValidation = {
  name: string;
  amount: number | string;
  connect: number | string;
  duration: number;
};
export type PlanTypeWithStringKeys = {
  _id: string;
  name?: string;
  delete?: boolean;
  duration?: number;
  features?: string[];
  amount?: number;
  connect?: number;
  Expiry?: Date;
};

export type PlanValidation = {
  [index in keyof PlanTypeWithStringKeys]: string | boolean | Date | string[];
};

////////////dash ralated
export interface DashCardProps {
  Title: string;
  Data: number;
  img: string;
}

////////////subscriber list related////////////

export type SubscriberTableDataType = {
  no: number;
  username: string;
  planName: string;
  expiry: string;
  MatchCountRemaining: number;
  planAmount: number;
};

export type EmojiMartEmoji = {
  native: string;
  id?: string;
  name?: string;
  [key: string]: unknown;
};
export type PlanData = {
  name: string;
  connect: number;
  duration: number;
  features: string[];
  amount: number;
  _id: string;
  avialbleConnect: number;
  Expiry: Date;
};

/////////////edit validator//////

export type editValidatorwarning = {
  firstName: string;
  secondName: string;
  state: string;
  dob: string;
  email: string;
};

////////////////user profile type //////////


export type profileType = {
  _id: string;
  interest: string[];
  photo: string;
  lookingFor: string;
  name: string;
  no: number;
  secondName: string;
  state: string;
  age: number;
  gender: string;
  dateOfBirth: Date | string;
  matchStatics?: string;
};

export type MatchedProfileType = {
    firstName: string;
    secondName: string;
    photo: string;
    state: string;
    dateOfBirth: string;
    age: number;
    _id: string;
  };
  export type RequtestUser = {
      _id: string;
      status: string;
      typeOfRequest: string;
      name: string;
    };

    export interface CredentialInterface {
      [key: string]: string;
    }
     export interface InputArrayProbs {
      inputFields: {
        linkingName: string;
        inputType: string;
        inputName: string;
        option?: string[];
      }[];
      toggle: number;
    }
    export type PhotoAndInterest = {
      photo?: File | null;
      interest?: string[];
    };

    export interface PhotAndIntInterface {
      probState: PhotoAndInterest;
      probSetter: Dispatch<SetStateAction<PhotoAndInterest>>;
    }
////////////interst related/////

export  type interestType = { sports: string[]; music: string[]; food: string[] };