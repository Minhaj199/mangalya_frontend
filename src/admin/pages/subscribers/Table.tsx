import React, { useEffect, useMemo, useState } from "react";
import {
  useTable,
  usePagination,
  Row,
  Cell,
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
} from "react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { Columns } from "./UserHeadSchema";
import { ISubscriberTableDataType } from "@/types/typesAndInterfaces";

import { request } from "@/utils/axiosUtil";
import { useNavigate } from "react-router-dom";
import { alertWithOk } from "../../../utils/alert/SweeAlert";
import { PlanDataType } from "@/types/typesAndInterfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface UserListInterface {
  triggerPagination: () => void;
}

const SubscriberTable: React.FC = () => {
  const navigate = useNavigate();

  const [MockData, setMockData] = useState<ISubscriberTableDataType[]>([]);
  const [planData, setPlanData] = useState<PlanDataType[]>([{ name: "" }]);
  const [searchWord, setSearchWord] = useState<string>("");

  ///fetch data///
  useEffect(() => {
    async function fetchData() {
      try {
        const data: data = await request({
          url: `/admin/fetchUserData?from=subscriber`,
          method: "get",
        });
        if (data.planData) {
          setPlanData(data.planData);
        }

        if (data?.message === "validation Faild") {
          alertWithOk("Validation", data.message || "Validation faild", "info");
          navigate("/login");
        }
        setMockData(data.userData);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "405") {
            alertWithOk(
              "subscriber",
              error.message || "error on dash",
              "error"
            );
            navigate("/login");
            return;
          } else {
            alertWithOk(
              "subscriber",
              error.message || "error on dash",
              "error"
            );
          }
        }
      }
    }
    fetchData();
  }, []);

  ///// fitlter data when sortin initiated
  const filterData = useMemo(() => {
    return MockData?.filter((plan) =>
      plan.planName.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase())
    );
  }, [searchWord, MockData]);

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => filterData ?? [], [filterData]);

  ///// sorting///////
  function handleFilter(value:string) {
    
    if (value === "All") {
      setSearchWord("");
    } else {
      setSearchWord(value);
    }
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
  } = useTable<ISubscriberTableDataType>(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    usePagination
  ) as TableInstance<ISubscriberTableDataType> &
    UsePaginationInstanceProps<ISubscriberTableDataType>;
  const { pageIndex } = state as UsePaginationState<ISubscriberTableDataType>;

  return (
    <>
      <div className="w-[100%] h-svh">
        <div className="h-full w-[100%]  flex flex-col items-center">
          <div className="w-full h-1/5   flex justify-center items-center">
            <div className="w-[95%] lg:mt-0 mt-20 h-5/6 drop-shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 bg-white rounded-lg flex justify-between items-center ">
              <p className=" ml-5 font-extrabold sm:text-base text-xs  font-inter text-dark-blue">
                SUBSCRIBER DATA
              </p>

              <Select onValueChange={handleFilter}
                              >
                <SelectTrigger id="gender" className="border border-blue-900 mr-3 h-8 w-20 sm:w-48   ">
                  <SelectValue placeholder="Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All' >All</SelectItem>
                  {planData[0].name !== "" &&
                  planData.map((el, index) => (
                      <SelectItem key={index} value={el.name}>{el.name}</SelectItem>
                  ))}
                  
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-[95%] h-3/5 mt-10 overflow-auto no-scrollbar ">
            <Paper>
              <Table
                {...getTableProps()}
                className="border-2 border-dark-blue bg-dark-blue"
              >
                <TableHead className="bg-dark-blue bottom-2  ">
                  {headerGroups.map((headerGroup, index) => (
                    <TableRow
                      {...headerGroup.getHeaderGroupProps()}
                      key={index}
                    >
                      {headerGroup.headers.map((column) => (
                        <TableCell
                          style={{ color: "white" }}
                          {...column.getHeaderProps()}
                          key={column.id}
                        >
                          {column.render("Header")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()} className="bg-gray-200 ">
                  {page.map(
                    (row: Row<ISubscriberTableDataType>, rowIndex: number) => {
                      prepareRow(row);
                      return (
                        <TableRow
                          {...row.getRowProps()}
                          key={rowIndex}
                          className="text-start hover:bg-slate-400 "
                        >
                          {row.cells.map(
                            (cell: Cell<ISubscriberTableDataType>) => (
                              <TableCell
                                className="text-lg"
                                {...cell.getCellProps()}
                              >
                                {cell.render("Cell")}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </Paper>
          </div>
          <div className="w-full h-1/5 flex justify-center items-center">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="bg-dark-blue text-white rounded-full sm:h-14 sm:w-14 h-8 w-8 sm:mb-0 mb-5"
            >
              {"<<"}
            </button>
            <span className="mx-2 sm:mb-0 mb-3">
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="bg-dark-blue text-white rounded-full sm:h-14 sm:w-14 h-8 w-8 ml-1 sm:mb-0 mb-5  font-bold "
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SubscriberTable;
