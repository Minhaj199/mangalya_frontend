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
export type PlanType  = {
  _id: string;
  name: string;
  delete: boolean;
  duration: number;
  features: string[];
  amount: number;
  connect: number;
}

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
export interface IDashCardProps {
  Title: string;
  Data: number;
  img: string;
}

////////////subscriber list related////////////
export type  ISubscriberTableDataType = {
    no: number;
    username: string;
    planName: string;
    expiry: string;
    MatchCountRemaining:number
    planAmount:number
}
export type PlanDataType = {
    name: string;
  };
export interface IDataForPlan {
    planData: PlanDataType[];
    userData: ISubscriberTableDataType[];
    message: string;
  }




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

export type EditValidatorwarning = {
  firstName: string;
  secondName: string;
  state: string;
  dob: string;
  email: string;
};

////////////////user profile type //////////


export type ProfileType = {
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

    export type  TableUserDataType = {
        _id:string,
        no: number;
        username: string;
        email: string;
        match: number;
        subscriber: boolean;
        expiry: string;
        block:boolean
    }
    export type NewAddedData = {
        name: string;
        age: number;
        image: string;
        place: string;
      };
export interface IToggle {
  setToggle: Dispatch<SetStateAction<string>>;
}

export interface IInputsProbs{
  inputFields:{
    linkingName:string,
    inputType:string,
    inputName:string,
    option?:string[]
    

  }[],
  setCredentialData:Dispatch<SetStateAction<ICredentialInterface>>
  setWarnning:Dispatch<SetStateAction<ICredentialInterface>>,
  CredentailData:{[key:string]:string},
  Warning:{[key:string]:string}
}
 export interface ITimerProbs{
    expiryTimeStamp:Date,
    from:string
    email?:string
    status?:boolean
}
export interface IForgot_Props{
  changeToggle:Dispatch<SetStateAction<string>>
}

export interface UserLoginProp extends IForgot_Props{
    loginTogle:string
    setLoading:Dispatch<SetStateAction<boolean>>
}

 export type LoginReponse={message:string,token:string,refresh:string,name:string,photo:string,partner:string,gender:string,subscriptionStatus:string}

export interface UserForm {
    email: string
    password: string
}

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

    export interface ICredentialInterface {
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

    export interface IPhotAndIntInterface {
      probState: PhotoAndInterest;
      probSetter: Dispatch<SetStateAction<PhotoAndInterest>>;
    }

    export type UserData = {
  PersonalInfo: {
    firstName: string;
    secondName: string;
    state: string;
    gender: string;
    dateOfBirth: string | Date;
    image?: File | string;
    interest?: string[] | null;
    photo: FormData | null;
  };
  partnerData: {
    gender: string;
  };
  email: string;

  subscriber: string;
};
////////////interst related/////

export  type InterestType = { sports: string[]; music: string[]; food: string[] };


/////////////redux/////////

export type StateProb = {
  photo: string;
  subscriptionStatus: string;
};

export interface IReduxState {
  userData: StateProb;
  onlinePersons: string[];
}

export type ReduxUserDataDispatchType =
  | { type: "SET_DATA"; payload: StateProb }
  | { type: "CLEAR_ONLINER"; payload: string[] }
  | { type: "CLEAR_DATA" }
  | { type: "SET_ONLINERS"; payload: string[] }
  | { type: "ADD_NEW_ONLINER"; payload: string };

///////////// edit validator//////////

export type EditWarning = {
  firstName: string;
  secondName: string;
  state: string;
  dob: string;
  email: string;
};

///////////edited data finder ////////


export type CurrentPlan={
    amount: number;
    connect: number;
    avialbleConnect: number;
    duration: number;
    features: string[];
    name: string;
    Expiry: Date
}
export type FetchBlankData = {
    PersonalInfo: {
      firstName: string;
      secondName: string;
      state: string;
      gender: string;
      dateOfBirth: Date;
      interest: string[];
      age: number;
      image: string;
    };
    PartnerData: { gender: string };
    Email: string;
    subscriptionStatus: string;
    currentPlan: CurrentPlan;
  };
 export interface IFindChange{
    dataToFind:UserData
    orginalData:FetchBlankData
    
  }

/////////////////signp///////////



export type SignupFirst = {
  "SECOND NAME": string;
  "DATE OF BIRTH": string;
  "DISTRICT THAT YOU LIVE": string;
  "YOUR GENDER": string;
  "GENDER OF PARTNER": string;
  EMAIL: string;
  PASSWORD: string;
  "FIRST NAME": string;
};

export interface ISignupContextType {
  signupFirstData: SignupFirst;
  setSignupFirst: React.Dispatch<React.SetStateAction<SignupFirst>>;
}
export interface IEmailForGotContextType {
  forgotEmail: string;
  setforgotEmail: React.Dispatch<React.SetStateAction<string>>;
}


  ///////////////jwt//////
export interface JWTPayload {
  auth: boolean;
  message: string;
  role?: string;
  id?: string;
  exp?: number;
}
