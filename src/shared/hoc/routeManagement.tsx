import React from 'react';
import { Outlet, Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {useSelector } from 'react-redux';
import { ReduxState } from '../../redux/reduxGlobal';

interface JWTPayload {
  auth: boolean;
  message: string;
  role?: string;
  id?: string;
  exp?: number;  
}


export const ProtectRouteAdmin: React.FC = () => {
 
  let setIsAuthorised=false

    const token = localStorage.getItem('adminToken');
    if (token && typeof token === 'string') {
      const decoded = jwtDecode<JWTPayload>(token);

      if (decoded && decoded.exp && Date.now() / 1000 < decoded.exp) {
        if(decoded.role==='admin'){
          
          setIsAuthorised=true;  
        }
      } else {
        localStorage.removeItem('adminToken');  
       setIsAuthorised=false
      }
    }
 
 
  return setIsAuthorised ? <Outlet /> : <Navigate to="/login" />;
};


export const UnProtectRouteAdmin: React.FC = () => {
 
  let setIsAuthorised=false
    
 
    const token = localStorage.getItem('adminToken');
    if (token && typeof token === 'string') {
      const decoded = jwtDecode<JWTPayload>(token);

      if (decoded && decoded.exp && Date.now() / 1000 < decoded.exp) {
        if(decoded.role==='admin'){
          setIsAuthorised=true;  
        }  
      } else {
        localStorage.removeItem('adminToken');  
       setIsAuthorised=false
      }
    }
   
   
  return setIsAuthorised ?<Navigate to="/admin/manageUser"/> :<Outlet/> ;
};

export const ProtectRouteUser: React.FC = () => {
 
  let setIsAuthorised=false

    const token = localStorage.getItem('userToken');
    if (token && typeof token === 'string') {
      setIsAuthorised=true
      
    }
  return setIsAuthorised ? <Outlet /> : <Navigate to="/" />;
};
export const UnProtectRouteUser: React.FC = () => {
 
  let setIsAuthorised=false
 
    const token = localStorage.getItem('userToken');
    if (token && typeof token === 'string') {
      setIsAuthorised=true
    }
  
  return setIsAuthorised ?<Navigate to="/loginLanding"/> :<Outlet/> ;
};
export const PlanRouteUser: React.FC = () => {
  
  const userData=useSelector((state:ReduxState)=>state.userData)
 
  let setIsAuthorised=false
 
    if(userData.subscriptionStatus&&userData.subscriptionStatus==='subscribed'){
        setIsAuthorised=true
    }
   
  return setIsAuthorised ?<Navigate to="/loginLanding"/> :<Outlet/> ;
};


