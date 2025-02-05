import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


export type StateProb = {
  photo: string;
  subscriptionStatus: string;
};

export interface ReduxState {
  userData: StateProb;
  onlinePersons: string[];
}


const initialState: ReduxState = {
  userData: {
    photo: '',
    subscriptionStatus: '',
  },
  onlinePersons: [],
};



export type ReduxUserDataDispatchType =| { type: 'SET_DATA'; payload: StateProb }|{type:'CLEAR_ONLINER';payload:string[]}| { type: 'CLEAR_DATA' }| { type: 'SET_ONLINERS'; payload: string[] }| { type: 'ADD_NEW_ONLINER'; payload: string };


const appReducer = (
  state: ReduxState = initialState,
  action: ReduxUserDataDispatchType
): ReduxState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, userData: { ...action.payload } };
    case 'CLEAR_DATA':
      return initialState
    case 'SET_ONLINERS':
      return { ...state, onlinePersons: action.payload };
    case 'ADD_NEW_ONLINER':
      return { ...state, onlinePersons: [...state.onlinePersons, action.payload] };
    case 'CLEAR_ONLINER':
      return { ...state, onlinePersons:[]};
    default:
      return state;
  }
};


const persistConfig = {
  key: 'root',
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
