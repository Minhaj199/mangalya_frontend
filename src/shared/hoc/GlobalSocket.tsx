import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { ReduxState } from "../../redux/reduxGlobal";
import store from "../../redux/reduxGlobal";
import { useSelector } from "react-redux";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const onliners = useSelector((state: ReduxState) => state.onlinePersons);

  useEffect(() => {
    const newSocket: Socket = io(import.meta.env.VITE_BACKENT_URL);

    const userId = localStorage.getItem("userToken");
    if (userId) {
      newSocket.emit("register", { userId });
      socket?.on("newUserOnline", (data) => {
        if (data.id) {
          alert('global')
          store.dispatch({ type: "ADD_NEW_ONLINER", payload: data.id });

        }
      });
      socket?.on("user_loggedOut", (data: { id: string }) => {
        store.dispatch({
          type: "SET_ONLINERS",
          payload: onliners.filter((el) => el !== data.id),
        });
      });
    }

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {socket ? children : <div>Connecting to Socket...</div>}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn(
      "Socket is not available. Make sure SocketProvider is wrapping your component."
    );
  }
  return socket;
};
