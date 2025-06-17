export type  SubscriberTableDataType = {
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
export interface data {
    planData: PlanDataType[];
    userData: SubscriberTableDataType[];
    message: string;
  }
