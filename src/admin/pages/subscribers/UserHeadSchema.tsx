import { Column } from "react-table";
import { ISubscriberTableDataType } from "@/types/typesAndInterfaces";
export const Columns: Column<ISubscriberTableDataType>[] = [
  {
    Header: "no",
    accessor: "no",
  },
  {
    Header: "User",
    accessor: "username",
  },
  {
    Header: "Plan",
    accessor: "planName",
  },
  {
    Header: "Avialble count",
    accessor: "MatchCountRemaining",
  },

  {
    Header: "Expiry",
    accessor: "expiry",
  },
  {
    Header: "Plan amount",
    accessor: "planAmount",
  },
];
