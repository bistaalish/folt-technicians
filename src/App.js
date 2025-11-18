import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DeviceLayout from "./layout/DeviceLayout";
import DevicePage from "./pages/DevicePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Device from "./pages/Device";
import ONUDetailPage from "./pages/ONUDetailPage";
import AddONUPage from "./pages/AddONUPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login */}
        <Route path="/" element={<Login />} />

        {/* Authenticated Area */}
        <Route
          element={
            <ProtectedRoute>
              <DeviceLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/device" element={<Device />} />
          <Route path="/device/:id" element={<DevicePage />} />
          
          {/* Corrected ONU Detail Route */}
          <Route path="/device/:id/onu/:sn" element={<ONUDetailPage />} />
          <Route path="/device/:id/add" element={<AddONUPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
