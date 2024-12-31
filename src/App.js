import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

// Views
import Home from './views/home';
import Menu from './views/menu';
import DefFlowers from './views/defFlowers';
import ViewOrder from './views/viewOrder';
import MakeFlowers from './views/makeFlowers';

function App() {
  const location = useLocation();

  return (
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
              <Menu />
            </motion.div>
          }
        />
        <Route
          path="/Predeterminados"
          element={
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5 }}
              style={{height: "100%"}}>
              <DefFlowers />
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
              <MakeFlowers />
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
              <ViewOrder />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function AnimatedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
