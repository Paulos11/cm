import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store";
import PrivateRoute from "./Routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";  // Import the new Dashboard component
import Members from "./pages/Members";
import Offerings from "./pages/Offerings";
import Expenses from "./pages/Expenses";
import Sermons from "./pages/Sermons";
import SermonDetail from "./pages/SermonDetail ";  // Note the space, or remove it if you renamed the file
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import "./utils/axiosSetup";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="offerings" element={<Offerings />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="sermons" element={<Sermons />} />
            <Route path="sermons/:id" element={<SermonDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
};

export default App;