import { ReportModal } from "@/components/admin/abuseModalAction/AbuseAction";
import CircularIndeterminate from "@/components/circularLoading/Circular";
import { IAbuserReport } from "@/types/typesAndInterfaces";
import { alertWithOk, handleAlert, promptSweet } from "@/utils/alert/SweeAlert";
import { request } from "@/utils/axiosUtilsTemp"; 

import { Trash2, Mail, MailOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Abuse() {
  const [reports, setReports] = useState<IAbuserReport[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<IAbuserReport>({
    _id: "",
    rejected: true,
    block: false,
    createdAt: new Date(),
    moreInfo: "",
    read: true,
    reason: "",
    reported: { _id: "", PersonalInfo: { firstName: "" } },
    reporter: { _id: "", PersonalInfo: { firstName: "" } },
    warningMail: true,
  });

  useEffect(() => {
    try {
      async function fetch() {
        const response: { data: IAbuserReport[]; message: string } =
          await request({ url: "/admin/getReports" });

        if (response.message) {
          throw new Error(response.message);
        }
        setReports(response.data);
      }
      fetch();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "405") {
          navigate("/login");
          return;
        }
        handleAlert("error", error.message || "error on report fetching");
      }
      console.log(error);
    }
  }, []);

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  ///////////////////////handle modal//////////////////

  function handleLoadDetails(index: number) {
    setCurrentData(reports[index]);
    setIsOpen(true);
  }

  const toggleRead = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    let status = false;
    reports.forEach((el) => {
      if (el._id === id) {
        status = el.read;
      }
    });
    try {
      const response: { status: boolean; message: string } = await request({
        url: "/admin/reportToggle/" + id,
        method: "patch",
        data: { status: !status },
      });
      if (response.message) {
        throw new Error(response.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "405") {
          navigate("/login");
          return;
        }
        alertWithOk("report abuse", error.message || "error on dash", "error");
      }
    }

    setReports((el) =>
      el.map((el) => ({ ...el, read: el._id === id ? !el.read : el.read }))
    );

    e.stopPropagation();
  };

  const deleteMessage = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    try {
      await promptSweet(
        () => deleteMsg(),
        "Do you want to delete the message",
        "Message Deleted"
      );
      async function deleteMsg() {
        const response: { data: boolean; message: string } = await request({
          url: "/admin/deleteMsg/" + id,
          method: "delete",
        });
        if (response.message) {
          throw new Error(response.message);
        }
        setReports((messages) => messages.filter((msg) => msg._id !== id));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "405") {
          navigate("/login");
          return;
        }
        alertWithOk("report abuse", error.message || "error on dash", "error");
      }
    }
  };
  return (
    <>
      {loading && (
        <div className="w-full flex items-center justify-center  h-full  fixed bg-[rgba(0,0,0,.8)] z-50">
          <CircularIndeterminate />
        </div>
      )}
      <div className="container   pt-16 sm:px-24 px-2">
        <ReportModal
          isOpen={isOpen}
          setOpen={setIsOpen}
          setReport={setReports}
          reportData={currentData}
          setLoading={setLoading}
        />

        <div className="w-full max-h-[60%] bg-white pb-14  border border-blue-400 rounded-xl overflow-y-auto">
          <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="space-y-4">
              {reports.map((message, index) => (
                <div
                  onClick={() => handleLoadDetails(index)}
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105  ${
                    message.read ? "bg-gray-50" : "bg-white border-green-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">
                        {message.reason}
                      </h2>
                      <p className="text-gray-600 text-xs">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => toggleRead(message._id, e)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title={message.read ? "Mark as unread" : "Mark as read"}
                      >
                        {message.read ? (
                          <MailOpen className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
                      <button
                        onClick={(e) => deleteMessage(message._id, e)}
                        className="p-2 hover:bg-gray-100 rounded-full text-red-600"
                        title="Delete message"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Abuse;
