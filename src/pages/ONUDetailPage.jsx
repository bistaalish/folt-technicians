import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { searchONUBySN, rebootONU, deleteONU } from "../api/devices";

const ONUDetailPage = () => {
  const { id, sn } = useParams(); // Device ID and ONU SN
  const location = useLocation();
  const navigate = useNavigate();
  const { device } = location.state || {}; // optional device info

  const [onuDetails, setONUDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // "reboot" or "delete"
  const [error, setError] = useState("");

  // Fetch ONU details on mount
  useEffect(() => {
    const fetchONU = async () => {
      setLoading(true);
      try {
        const data = await searchONUBySN(id, sn);
        setONUDetails(data);
      } catch (err) {
        console.error("Failed to fetch ONU:", err);
        setError("Unable to fetch ONU details.");
      }
      setLoading(false);
    };
    fetchONU();
  }, [id, sn]);

  // Handle reboot
  const handleReboot = async () => {
    if (!onuDetails) return;
    const confirmed = window.confirm("Are you sure you want to reboot this ONU?");
    if (!confirmed) return;

    setActionLoading(true);
    setActionType("reboot");

    try {
      const res = await rebootONU(id, onuDetails.FSP, onuDetails.ONTID);
      alert(res.message || "ONU rebooted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to reboot ONU.");
    }

    setActionLoading(false);
    setActionType("");
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onuDetails) return;
    const confirmed = window.confirm("Are you sure you want to delete this ONU?");
    if (!confirmed) return;

    setActionLoading(true);
    setActionType("delete");

    try {
      const res = await deleteONU(
        id,
        onuDetails.FSP,
        onuDetails.ONTID,
        onuDetails.SN,
        onuDetails.Description
      );
      alert(res.message || "ONU deleted successfully!");
      navigate(-1); // Go back after deletion
    } catch (err) {
      console.error(err);
      alert("Failed to delete ONU.");
    }

    setActionLoading(false);
    setActionType("");
  };

  if (loading) return <p className="p-6 text-white">Loading ONU details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!onuDetails) return <p className="p-6 text-white">ONU not found.</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-[#1b1b1b] shadow-lg rounded-2xl p-6 w-[70%] max-w-3xl border border-gray-700">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded text-white"
        >
          &larr; Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4 text-green-400">ONU Details</h1>

        {/* Device Info */}
        <p className="text-gray-400 mb-4">
          Device: {device?.name || "Unknown"} ({device?.ip || "Unknown IP"})
        </p>

        {/* ONU Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-2 bg-gray-900 rounded">
            <strong>Status:</strong> {onuDetails.status || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded">
            <strong>FSP:</strong> {onuDetails.FSP || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded">
            <strong>ONTID:</strong> {onuDetails.ONTID || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded">
            <strong>Description:</strong> {onuDetails.Description || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded">
            <strong>Vendor SN:</strong> {onuDetails.VendorSN || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded">
            <strong>SN:</strong> {onuDetails.SN || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded">
            <strong>Line Profile:</strong> {onuDetails.LineProfile || "N/A"}
          </div>
          <div className="p-2 bg-gray-900 rounded col-span-2">
            <strong>Last Down Cause:</strong> {onuDetails.Lastdowncause || "N/A"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={handleReboot}
            disabled={actionLoading}
            className={`px-4 py-2 rounded font-semibold text-white ${
              actionLoading && actionType === "reboot"
                ? "bg-yellow-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {actionLoading && actionType === "reboot" ? "Rebooting..." : "Reboot"}
          </button>

          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className={`px-4 py-2 rounded font-semibold text-white ${
              actionLoading && actionType === "delete"
                ? "bg-red-600 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {actionLoading && actionType === "delete" ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ONUDetailPage;
