import { useState, useEffect } from 'react';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
//Scripts
import { validateToken, getItemsById } from './scripts/apis';
// Views Usuario
import Home from './user/views/home';
import Menu from './user/views/menu';
import DefFlowers from './user/views/defFlowers';
import Login from './user/views/login';
import LoadPage from './user/views/loadPage';
const UserSettings = lazy(() => import('./user/views/userSettings'));
const MakeFlowers = lazy(() => import('./user/views/makeFlowers'));
const ViewOrder = lazy(() => import('./user/views/viewOrder'));
const HandlePay = lazy(() => import('./user/views/handlePay'));
const HandlePayBouquet = lazy(() => import('./user/views/handlePayBouquet'));
//Views Administrador
const AdminHome = lazy(() => import('./admin/views/home'));
const AdminMenu = lazy(() => import('./admin/views/menu'));
const AdminDefFlowers = lazy(() => import('./admin/views/defFlowers'));
const AdminMakeFlowers = lazy(() => import('./admin/views/makeFlowers'));
const AdminUsers = lazy(() => import('./admin/views/adminUsers'));
const AdminViewOrder = lazy(() => import('./admin/views/viewOrder'));



function App() {
  const location = useLocation();
  const [isLogged, setIsLogged] = useState({
    user:   'user0',
    token: 'noToken',
    id: '',
    type: true,// admin: false y user: true
    login: false,
  });
  
  useEffect(() => {
    const validateSession = async () => {
      try {
          const isTokenValid = await validateToken();
          if (isTokenValid?.isValid) {
            const response = await getItemsById('accounts', isTokenValid.id);
            setIsLogged((prev) => ({
              ...prev,
              user: response.user,
              id: isTokenValid.id,
              type: response.type,
              login: true,
            }));
          } 
        
      } catch (error) {
        //alert('Sesión cerrada');
        console.error(error);
      }
    };

    validateSession();
  }, []);
  

  /*document.addEventListener('keypress', (e) => {
    if(e.key === "u"){
        setIsLogged((prev) => ({...prev, type: isLogged.type === "user" ? "admin":"user"}));
    }
    if(e.key === "l"){
        setIsLogged((prev) => ({...prev, login: !isLogged.login}));
    }
})*/

  //Usuario
  if(isLogged.type){
    return (
      <Suspense fallback={<LoadPage/>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/loadPage"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <LoadPage />
                </motion.div>
              }
            />
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/A.C-Flower-Deliveri-Web"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/Menu"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <Menu isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/Ramos"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <DefFlowers isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/ArmarRamo"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <MakeFlowers isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/ConsultarPedido"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <ViewOrder isLogged = {isLogged}/>
                </motion.div>
              }
            />
            {isLogged.login ? 
            <Route
              path="/Ajustes"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <UserSettings isLogged = {isLogged}/>
                </motion.div>
              }
            />
            :
            <Route
              path="/Login"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <Login isLogged = {isLogged}/>
                </motion.div>
              }
            />
            }
            <Route
              path="/handlePay"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <HandlePay/>
                </motion.div>
              }
            />
            <Route
              path="/handlePayBouquet"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <HandlePayBouquet/>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      );
  }
  //Administrador
  if(!isLogged.type){
    return (
      <Suspense fallback={<LoadPage/>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5 }}
                style={{height: "100%"}}>
                <AdminHome isLogged={isLogged}/>
              </motion.div>
            }
          />
          <Route
            path="/Home"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5 }}
                style={{height: "100%"}}>
                <AdminHome isLogged={isLogged}/>
              </motion.div>
            }
          />
          <Route
            path="/Menu"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5 }}
                style={{height: "100%"}}>
                <AdminMenu isLogged={isLogged}/>
              </motion.div>
            }
          />
           <Route
              path="/Ramos"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <AdminDefFlowers isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/ArmarRamo"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <AdminMakeFlowers isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/ConsultarPedido"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <AdminViewOrder isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/AdminUsuarios"
              element={
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: "0" }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <AdminUsers isLogged = {isLogged}/>
                </motion.div>
              }
            />
            <Route
              path="/Ajustes"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5 }}
                  style={{height: "100%"}}>
                  <UserSettings isLogged = {isLogged}/>
                </motion.div>
              }
            />
        </Routes>
      </AnimatePresence>
      </Suspense>
    );
  }
  
}

export default function AnimatedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
