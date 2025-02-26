import React, { useEffect, useRef } from "react";
import { Navbar } from "../../components/user/navbar/Navbar";
import { useState } from "react";
import store, { ReduxState } from "../../redux/reduxGlobal";
import { showToast as toastAlert } from "@/utils/alert/toast";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Trash2, Flag, Search } from "lucide-react";
import { request } from "@/utils/AxiosUtils";
import { alertWithOk, handleAlert } from "@/utils/alert/SweeAlert";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/shared/hoc/GlobalSocket";
import { useSelector } from "react-redux";
import { Footer } from "@/components/user/footer/Footer";

export const Matched = () => {
  const onliners = useSelector((state: ReduxState) => state.onlinePersons);

  const [showToast, setShowToast] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [fetchedProfiles, setFetchedProfiles] = useState<MatchedProfileType[]>(
    []
  );
  const [currentItems, setCurrentItems] = useState<MatchedProfileType[]>([]);
  const [place, setPlaces] = useState<string[]>([]);
  const [reportedId, setReportedId] = useState<string>("");
  const [onliner, setOnliner] = useState<string[]>([]);
  const navigate = useNavigate();
  type MatchedProfileType = {
    firstName: string;
    secondName: string;
    photo: string;
    state: string;
    dateOfBirth: string;
    age: number;
    _id: string;
  };

  ////////////fetch data/////////
  interface Response {
    fetchMatchedUsers:
      | {
          formatedResponse: MatchedProfileType[];
          Places: string[];
          onlines: string[];
        }
      | [];
    message: string;
  }
  const ref = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      if (ref.current === 0) {
        ref.current++;
        try {
          const response: Response = await request({
            url: "/user/matchedUsers",
          });

          if (response.message) {
            throw new Error(response.message);
          }
          if (Array.isArray(response.fetchMatchedUsers)) {
            setFetchedProfiles([]);
            setCurrentItems([]);
          } else {
            setFetchedProfiles(response.fetchMatchedUsers.formatedResponse);
            setCurrentItems(response.fetchMatchedUsers.formatedResponse);
            setPlaces(response.fetchMatchedUsers.Places);
            setOnliner(response.fetchMatchedUsers.onlines);

            store.dispatch({
              type: "SET_ONLINERS",
              payload: response.fetchMatchedUsers.onlines,
            });
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            alertWithOk(
              "Profile loading",
              error.message || "error on data loading",
              "error"
            );
          }
          console.warn(error);
        }
      }
    };
    fetchData();
  }, []);

  ////////////handle sorting/////////////////

  function handleSorting(value: string) {
    if (value === "reset") {
      setCurrentItems(fetchedProfiles);
      return;
    }
    setCurrentItems(fetchedProfiles.filter((el) => el.state === value));
  }

  //////////////pagination logic///////////////////////
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 5;
  const [totalPages, setTotalPage] = useState(1);
  const [pageNumber, setPageNumber] = useState([0]);
  const [reportData, setReportData] = useState<{
    reason: string;
    moreInfo: string;
  }>({ moreInfo: "", reason: "" });
  useEffect(() => {
    setCurrentItems(
      fetchedProfiles?.slice(
        (currentPage - 1) * itemPerPage,
        currentPage * itemPerPage
      )
    );
    setTotalPage(Math.ceil(fetchedProfiles?.length / itemPerPage));
    setPageNumber(Array.from({ length: totalPages }, (_, i) => i + 1));
  }, [totalPages, fetchedProfiles, currentPage]);
  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const goBack = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const socket = useSocket();
  useEffect(() => {
    socket?.on("newUserOnline", (data) => {
      if (data.id && !onliner.includes(data.id)) {
        store.dispatch({ type: "ADD_NEW_ONLINER", payload: data.id });
      }
    });
    socket?.on("errorFromSocket", (data: { message: string }) => {
      toastAlert(data.message, "error");
    });
    socket?.on("user_loggedOut", (data: { id: string }) => {
      store.dispatch({
        type: "SET_ONLINERS",
        payload: onliners.filter((el) => el !== data.id),
      });
    });
    socket?.on("errorFromSocket", (data) => {
      toastAlert(data.message, "error");
    });
    socket?.on("new_connect", (data) => {
      if (data.data) {
        toastAlert("new request arraived", "info");
      }
    });
    function handleFuncton(data: { name: string; from: "accept" | "reject" }) {
      if (data.from === "accept") {
        toastAlert(
          `${data.name ? data.name : "partner"} accepted your request`
        );
      } else {
        toastAlert(
          `${data.name ? data.name : "partner"} declined your request`,
          "warning"
        );
      }
    }
    socket?.on("requestStutus", handleFuncton);
    return () => {
      socket?.off("new_connect");
      socket?.off("requestStutus", handleFuncton);
      socket?.off("errorFromSocket");
      socket?.off("newUserOnline");
      socket?.off("user_loggedOut");
    };
  }, []);

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = async (userId: string) => {
    try {
      const response: { status: boolean; message: string } = await request({
        url: "/user/deleteMatched",
        method: "delete",
        data: { id: userId },
      });

      if (response && response.status) {
        setFetchedProfiles((el) => el.filter((elem) => elem._id !== userId));
        setCurrentPage(1);
        showNotification("User removed successfully");
      } else {
        throw new Error(response.message || "error on deletein");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertWithOk(
          "account deletion",
          error.message || "error on deletion",
          "error"
        );
      }
      console.warn(error);
    }
  };

  const handleReport = async (userId: string) => {
    if (reportData.reason === "") {
      handleAlert("warning", "please fill more reason");
      return;
    }
    if (reportData.moreInfo.trim() === "")
      handleAlert("warning", "please fill more info");
    try {
      const response: { data: boolean | []; message: string } = await request({
        url: "/user/reportAbuse",
        method: "post",
        data: {
          reason: reportData.reason,
          moreInfo: reportData.moreInfo,
          profileId: userId,
        },
      });
      if (response.message) {
        throw new Error(response.message || "error on report abuse");
      }
      if (response.data) {
        showNotification("Report submitted successfully");
        setReportModalOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleAlert("error", error.message || "error on report abuse");
      }
      console.warn(error);
    }
  };

  const handleSerch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItems(
      fetchedProfiles.filter((el) =>
        el.firstName.toLowerCase().includes(e.target.value.toLocaleLowerCase())
      )
    );
  };

  //////////////////handling reporting//////////////////

  return (
    <div className="h-auto w-auto bg-slate-200 min-h-svh">
      <div className="container mx-auto px-4 py-8 ">
        <Navbar active="matched" />
        <div className="w-auto h-auto mt-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Profiles</h1>

            {/* Search and Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px] ">
                <div className="relative">
                  <div
                    className="absolute flex justify-center items-center  right-0.5 rounded-full top-0 h-9 w-9 
               text-gray-500"
                  >
                    <Search className="w-[60%] text-amber-900 h-[40%] outline-none opacity-70" />
                  </div>
                  <Input
                    onChange={handleSerch}
                    placeholder="Search users..."
                    className="pl-4 rounded-full bg-white placeholder:text-amber-900 placeholder:opacity-70 "
                  />
                </div>
              </div>

              <Select
                onValueChange={handleSorting}
                disabled={place?.length === 0}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reset">All</SelectItem>
                  {place.map((el, index) => {
                    return (
                      <SelectItem key={index} value={el}>
                        {el}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>

          {/* Profiles Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {currentItems ? <></> : <></>}
            {currentItems?.length > 0 &&
              currentItems?.map((user) => (
                <>
                  <Card
                    key={user._id}
                    className="hover:shadow-2xl transition-shadow  relative shadow-blue-300"
                  >
                    {/* <div className='w-6 h-6 rounded-full bg-blue-400 absolute top-3 right-10 inline-flex justify-center items-center font-semibold text-white'>9</div> */}
                    {onliners.includes(user._id) && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    )}
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt="X"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src="./photoUpload.png"
                            alt="X"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">
                          {user.firstName}
                        </h2>
                        <p className="text-gray-500">
                          {user.state} • {user.age}
                        </p>
                      </div>
                    </CardHeader>

                    <CardFooter className=" gap-1 pt-4  overflow-hidden ">
                      <Button
                        variant="outline"
                        className="flex-1 border text-blue-500 border-blue-500 hover:bg-blue-700 hover:text-white transition-colors duration-500 ease-in-out "
                        onClick={() =>
                          navigate("/chat", { state: { id: user._id } })
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2 " />
                        Message
                      </Button>

                      {/* Delete Confirmation Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 border text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-500 ease-in-out"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this user from
                              your accepted list? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user._id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Report User Dialog */}
                      <Dialog
                        open={reportModalOpen}
                        onOpenChange={setReportModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setReportedId(user._id)}
                            className="flex-1 border text-yellow-300 border-yellow-300 hover:bg-yellow-500 transition-colors duration-500 ease-in-out hover:text-white"
                          >
                            <Flag className="w-4 h-4 mr-2" />
                            Report
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report User</DialogTitle>
                            <DialogDescription>
                              Please provide details about your concern
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <Select
                              onValueChange={(value) =>
                                setReportData((el) => ({
                                  ...el,
                                  reason: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="spam">Spam</SelectItem>
                                <SelectItem value="inappropriate">
                                  Inappropriate Person
                                </SelectItem>
                                <SelectItem value="harassment">
                                  Harassment
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>

                            <Textarea
                              onChange={(t) =>
                                setReportData((el) => ({
                                  ...el,
                                  moreInfo: t.target.value,
                                }))
                              }
                              placeholder="Provide additional details..."
                              className="min-h-[100px]"
                            />
                          </div>

                          <DialogFooter className="mt-4">
                            <Button onClick={() => handleReport(reportedId)}>
                              Submit Report
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </>
              ))}
          </div>
          {currentItems?.length <= 0 && (
            <div className="w-full flex justify-center items-center h-[300px] ">
              <div className="sm:w-1/2 w-full h-full">
                <img src="/NoDataFound.jpg" className="w-full h-full" alt="" />
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
              {toastMessage}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            {currentItems?.length &&
              pageNumber?.map((el) => (
                <Button
                  className={el === currentPage ? "bg-blue-300 text-white" : ""}
                  key={el}
                  onClick={() => setCurrentPage(el)}
                  variant="outline"
                >
                  {el}
                </Button>
              ))}

            <Button
              onClick={goNext}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
