
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SignupProvider } from './shared/globalCondext/signupData.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/reduxGlobal.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './shared/hoc/GlobalSocket.tsx';





createRoot(document.getElementById('root')!).render(
  
    <Provider store={store}>
     
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
         <SocketProvider>
            <SignupProvider>
              <ToastContainer />
              <App />
            </SignupProvider>
         </SocketProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
 
);
