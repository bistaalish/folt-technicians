import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addONU, getDeviceServices, searchONUBySN, deleteONU } from "../api/devices";

const AddONUPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { onu, device } = location.state || {};

  const [onuInfo, setOnuInfo] = useState(null); // result from searchONUBySN
  const [notFoundMsg, setNotFoundMsg] = useState("");

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(""); // service_id

  const [nativeVlan, setNativeVlan] = useState(false);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔍 Search ONU in OLT
  useEffect(() => {
    const checkONU = async () => {
      if (!onu?.SN) return;
      try {
        const result = await searchONUBySN(id, onu.SN);
        if (result.detail) {
          setNotFoundMsg(result.detail);
          setOnuInfo(null);
          setDescription(onu.Description || "");
        } else {
          setOnuInfo(result);
          setDescription(result.Description || "");
        }
      } catch (err) {
        console.error(err);
      }
      setChecking(false);
    };
    checkONU();
  }, [id, onu]);

  // Fetch VLAN services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getDeviceServices(id);
        setServices(data);
        if (data.length > 0) setSelectedService(data[0].id);
      } catch (err) {
        console.error("Failed to load VLANs", err);
      }
    };
    fetchServices();
  }, [id]);

  // Toggle Native VLAN
  const handleNativeChange = () => {
    setNativeVlan(!nativeVlan);
    if (!nativeVlan) {
      setSelectedService(0); // native VLAN
    } else {
      if (services.length > 0) setSelectedService(services[0].id);
    }
  };

  // ➕ Add ONU
  const handleAddONU = async () => {
    setLoading(true);

    try {
      // Delete existing ONU if it exists
      if (onuInfo) {
        const confirmDelete = window.confirm(
          `ONU with SN ${onu.SN} already exists. Delete and continue?`
        );
        if (confirmDelete) {
          try {
            await deleteONU(
              id,
              onuInfo.FSP,
              onuInfo.ONTID,
              onuInfo.SN,
              onuInfo.Description
            );
            console.log("Existing ONU deleted successfully");
          } catch (delErr) {
            console.error("Failed to delete existing ONU", delErr);
            setError("Failed to delete existing ONU");
            setLoading(false);
            return;
          }
        } else {
          setLoading(false);
          return;
        }
      }

      // Prepare addONU payload using original onu object
      const fspParts = onu.FSP.split("/");
      const iface = fspParts.slice(0, fspParts.length - 1).join("/");
      const port = fspParts[fspParts.length - 1];

      const body = {
        SN: onu.SN,
        FSP: onu.FSP,
        interface: iface,
        port: port,
        service_id: selectedService,
        description: description,
        nativevlan: nativeVlan,
      };

      const res = await addONU(id, body);
      setSuccess(res.message || "ONU added successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add ONU");
      setSuccess("");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-[#1b1b1b] rounded-2xl p-6 w-full max-w-md border border-gray-700 text-white">

        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-4 text-green-400">Add ONU</h1>

        <p className="mb-2">
          Device: {device?.name} ({device?.ip})
        </p>

        {checking && <p className="text-yellow-400">Checking ONU in OLT...</p>}

        {notFoundMsg && (
          <p className="text-red-400 mb-4">Not Found: {notFoundMsg}</p>
        )}

        {onuInfo && (
          <div className="p-3 bg-gray-900 rounded mb-4 space-y-1">
            <p><strong>SN:</strong> {onuInfo.SN}</p>
            <p><strong>FSP:</strong> {onuInfo.FSP}</p>
            <p><strong>LineProfile:</strong> {onuInfo.LineProfile}</p>
            <p><strong>Last Down:</strong> {onuInfo.Lastdowncause}</p>
          </div>
        )}

        {/* Native VLAN Toggle */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={nativeVlan}
            onChange={handleNativeChange}
            className="w-5 h-5 accent-green-500"
          />
          <span>Use Native VLAN</span>
        </div>

        {/* VLAN selection */}
        <div className="mb-4">
          <label className="block mb-1">VLAN:</label>
          <select
            disabled={nativeVlan}
            value={selectedService}
            onChange={(e) => setSelectedService(Number(e.target.value))}
            className={`w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded ${
              nativeVlan ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.vlan}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1">Description:</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded"
          />
        </div>

        {/* Messages */}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        {/* Add Button */}
        <button
          disabled={loading || checking}
          onClick={handleAddONU}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50"
        >
          {checking ? "Checking..." : loading ? "Processing..." : "Add ONU"}
        </button>
      </div>
    </div>
  );
};

export default AddONUPage;
