import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Image } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { request } from "@/utils/AxiosUtils";
import { handleAlert } from "@/utils/alert/SweeAlert";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { useSocket } from "@/shared/hoc/GlobalSocket";
import { useSelector } from "react-redux";
import store, { ReduxState } from "@/redux/reduxGlobal";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { showToast } from "@/utils/alert/toast";

const ChatInterface = () => {
  const onliners = useSelector((state: ReduxState) => state.onlinePersons);

  const socket = useSocket();
  const [Loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    {
      _id: string;
      text: string;
      senderId: string;
      createdAt: string;
      image: boolean;
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState("");
  const [recieverData, setRecieverData] = useState<{
    name: string;
    image: string;
  }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef(null);
  const [emogi, setEmogi] = useState(false);
  const messageBox = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const ref = useRef(0);

  const addEmoji = (emoji: any) => {
    setInput((prev) => prev + emoji.native);
  };
  useEffect(() => {
    const fetch = async () => {
      if (chatId) {
        const messagesResponse: {
          senderId: string;
          text: string;
          createdAt: string;
          _id: string;
          image: boolean;
        }[] = await request({ url: `/user/getMessages/${chatId}` });
        setMessages(messagesResponse);
      }
    };
    fetch();
  }, [chatId]);
  useEffect(() => {
    socket?.emit("register_user", {
      userId: localStorage.getItem("userToken"),
    });

    const receiveMessage = (data: {
      _id: string;
      text: string;
      createdAt: string;
      senderId: string;
      image: boolean;
      chatId: string;
    }) => {
      setMessages((el) => [...el, data]);

      socket?.emit("makeReaded", { chatId: data.chatId });
    };
    socket?.on("recieveMessage", receiveMessage);
    socket?.on("errorFromSocket", (data: { message: string }) => {
      showToast(data.message, "error");
    });

    socket?.on("user_loggedOut", (data: { id: string }) => {
      store.dispatch({
        type: "SET_ONLINERS",
        payload: onliners.filter((el) => el !== data.id),
      });
    });
    function getOnliners(data: { id: string }) {
      store.dispatch((distpatch, getState: () => ReduxState) => {
        const updateOnliners = getState().onlinePersons;
        if (data.id && !updateOnliners.includes(data.id)) {
          distpatch({ type: "ADD_NEW_ONLINER", payload: data.id });
        }
      });
    }

    socket?.on("newUserOnline", getOnliners);
    return () => {
      socket?.off("user_loggedOut");
      socket?.off("recieveMessage", receiveMessage);
      socket?.off("newUserOnline", getOnliners);
      socket?.off("errorFromSocket");
    };
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const userData: { name: string; photo: string } = await request({
          url: `/user/userForChat/${location.state.id}`,
        });

        if (userData) {
          setRecieverData({ image: userData.photo, name: userData.name });
        }
        const response: { chatRoomId: string } = await request({
          url: `/user/getChats`,
          data: { id: location.state.id },
          method: "post",
        });

        if (response.chatRoomId) {
          setChatId(response.chatRoomId);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          handleAlert("error", error.message);
        }
        handleAlert("error", "error on message page");
      }
    };
    if (location.state.id && ref.current === 0) {
      ref.current++;
      fetch();
    }
  }, []);
  useEffect(() => {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }, [messages]);
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

  const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmogi(false);
    let imgUrl = "";
    setLoading(true);
    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      try {
        const url: { image: string } = await request({
          url: "user/saveImage",
          data: formData,
          method: "post",
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (url.image) {
          imgUrl = url.image;
          setMessages([
            ...messages,
            {
              _id: "",
              image: true,
              text: imgUrl,
              senderId: location.state.id,
              createdAt: new Date().toISOString(),
            },
          ]);
        }
        const response: {
          newMessage: {
            _id: string;
            text: string;
            senderId: string;
            receiverId: string;
            createdAt: Date;
            image: boolean;
          };
          messsage: string;
        } = await request({
          url: "/user/createChats",
          data: {
            senderIdString: localStorage.getItem("userRefresh"),
            receiverId: location.state.id,
            chatId: chatId,
            text: imgUrl,
            image: imgUrl !== "",
          },
          method: "post",
        });

        if (response.messsage)
          throw new Error(response.messsage || "erro on Chat");
        if (response.newMessage._id) {
          socket?.emit("sendMessage", {
            chatId: chatId,
            senderId: localStorage.getItem("userRefresh"),
            receiverId: response.newMessage.receiverId,
            text: response.newMessage.text,
            createdAt: new Date(response.newMessage.createdAt).toISOString(),
            _id: response.newMessage._id,
            image: response.newMessage.image,
          });
        }
        setFile(null);
        setPreview(null);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          handleAlert("error", error.message);
        }
        setLoading(false);
        handleAlert("error", "Error on photo sending");
      }
    }
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          _id: "",
          image: false,
          text: input,
          senderId: location.state.id,
          createdAt: new Date().toISOString(),
        },
      ]);

      try {
        const response: {
          newMessage: {
            _id: string;
            text: string;
            senderId: string;
            receiverId: string;
            createdAt: Date;
            image: boolean;
          };
          messsage: string;
        } = await request({
          url: "/user/createChats",
          data: {
            senderIdString: localStorage.getItem("userRefresh"),
            receiverId: location.state.id,
            chatId: chatId,
            text: input,
            image: imgUrl !== "",
          },
          method: "post",
        });
        if (response.messsage)
          throw new Error(response.messsage || "erro on Chat");
        if (response.newMessage._id) {
          socket?.emit("sendMessage", {
            chatId: chatId,
            senderId: localStorage.getItem("userRefresh"),
            receiverId: response.newMessage.receiverId,
            text: response.newMessage.text,
            createdAt: new Date(response.newMessage.createdAt).toISOString(),
            _id: response.newMessage._id,
            image: response.newMessage.image,
          });
        }
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setLoading(false);
          handleAlert("error", error.message);
        }
        handleAlert("error", "error on sending message");
      }

      setInput("");
    } else {
      setLoading(false);
    }
  };
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const [currentPhoto, setCurrentPhoto] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/match");
  };
  function openPhotoInput() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className="flex flex-col  h-svh max-w-full  bg-gradient-to-b from-gray-50 to-white shadow-xl ">
      {currentPhoto && (
        <div className="w-full h-full fixed  z-10 bg-[rgba(0,0,0,.8)] ">
          <div className="w-full h-full  flex relative justify-center items-center">
            <div className="sm:w-[50%]  sm:h-[80%] bg-red-400">
              <img src={currentPhoto} className="w-full h-full" alt="" />
            </div>
            <img
              src="deleteRemove.png"
              onClick={() => setCurrentPhoto("")}
              className="cursor-pointer w-6 h-6 absolute top-5 right-5 "
              alt=""
            />
          </div>
        </div>
      )}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4  flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="text-white hover:bg-blue-500/50 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          {recieverData?.image ? (
            <img
              src={recieverData?.image}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-white shadow-md"
            />
          ) : (
            <img
              src="./photoUpload.png"
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-white shadow-md"
            />
          )}
          <div>
            <h2 className="text-white font-semibold text-lg">
              {recieverData?.name}
            </h2>
            {onliners.includes(location.state.id) && (
              <span className="text-blue-100 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                online
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{ scrollBehavior: "smooth" }}
        ref={messageBox}
        className="flex-1 overflow-y-auto p-4 space-y-4 "
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start justify-end space-x-2 animate-fadeIn ${
              message.senderId === location.state.id
                ? ""
                : "flex-row-reverse space-x-reverse justify-end"
            }`}
          >
            <div className="flex flex-col">
              <span
                className={`text-xs mb-1 ${
                  message.senderId === location.state.id
                    ? "text-right"
                    : "text-left"
                } text-gray-500`}
              >
                {message.senderId === location.state.id
                  ? "You"
                  : recieverData?.name}
              </span>

              {message.image ? (
                <div
                  className={`relative max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm break-words ${
                    message.senderId === location.state.id
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none" // Outgoing style
                      : "bg-white border text-gray-800 rounded-tl-none" // Incoming style
                  }`}
                >
                  <div
                    className="w-10 h-10 cursor-pointer overflow-hidden"
                    onClick={() => setCurrentPhoto(message.text)}
                  >
                    <img src={message.text} alt="" />
                  </div>
                  <span className="block text-xs mt-3 opacity-75">
                    {formatTime(new Date(message.createdAt))}
                  </span>
                </div>
              ) : (
                <div
                  className={`relative max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm break-words ${
                    message.senderId === location.state.id
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none" // Outgoing style
                      : "bg-white border text-gray-800 rounded-tl-none" // Incoming style
                  }`}
                >
                  {message.text}
                  <span className="block text-xs mt-1 opacity-75">
                    {formatTime(new Date(message.createdAt))}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {/* Keeps the latest message in view */}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-lg ">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhoto}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={openPhotoInput}
            className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Image size={20} />
          </button>
          <div className="w-full relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-gray-200 p-4 rounded-full"
            />
            {Loading && (
              <div className="w-14 h-14 bg-blue-500 rounded-full text-center absolute -right-16 z-[1] bottom-0 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="text-white text-2xl"
                />
              </div>
            )}
            {file && (
              <div className="w-32 h-32 bg-green-400 absolute bottom-2 -left-11 rounded-lg">
                <div className="w-full h-full rounded-lg relative">
                  <img
                    className="w-full h-full rounded-lg"
                    src={preview || ""}
                    alt=""
                  />
                </div>
                <img
                  src="/deleteRemove.png"
                  className="w-5 h-5 top-2 right-2 absolute"
                  onClick={() => (setFile(null), setPreview(null))}
                  alt=""
                />
              </div>
            )}
            <FontAwesomeIcon
              onClick={() => setEmogi((el) => !el)}
              size="2xl"
              icon={faFaceSmile}
              className="text-[#000000] absolute right-4 top-3 cursor-pointer"
            />
            {emogi && (
              <div className="sm:w-52 sm:h-52 w-16 h-16  absolute sm:bottom-80 bottom-[450px]  sm:right-36 right-56">
                <Picker
                  data={data}
                  emojiSize={18}
                  style={{
                    width: "100px",
                    height: "200px",
                  }}
                  onEmojiSelect={addEmoji}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-4  bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Send size={18} type="submit" className="transform rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
