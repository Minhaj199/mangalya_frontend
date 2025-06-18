import { IReduxState, ReduxUserDataDispatchType } from "@/types/typesAndInterfaces";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";



const initialState: IReduxState = {
  userData: {
    photo: "",
    subscriptionStatus: "",
  },
  onlinePersons: [],
};



const appReducer = (
  state: IReduxState = initialState,
  action: ReduxUserDataDispatchType
): IReduxState => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, userData: { ...action.payload } };
    case "CLEAR_DATA":
      return initialState;
    case "SET_ONLINERS":
      return { ...state, onlinePersons: action.payload };
    case "ADD_NEW_ONLINER":
      return {
        ...state,
        onlinePersons: [...state.onlinePersons, action.payload],
      };
    case "CLEAR_ONLINER":
      return { ...state, onlinePersons: [] };
    default:
      return state;
  }
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
