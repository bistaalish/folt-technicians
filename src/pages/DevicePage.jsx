import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { autofindONUs } from "../api/devices";
import { searchONU } from "../api/onu";

const DevicePage = () => {
  const { id } = useParams(); // device id
  const location = useLocation();
  const navigate = useNavigate();

  const { name, ip } = location.state || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [autofindResults, setAutofindResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAutofind, setLoadingAutofind] = useState(false);

  // -----------------------------
  // 🔥 Handle Autofind
  // -----------------------------
  const handleAutofind = async () => {
    setLoadingAutofind(true);

    // Clear Search results
    setSearchResults([]);
    try {
      const results = await autofindONUs(id);

      const formatted = results.map((onu) => ({
        FSP: onu.FSP,
        ONTID: "N/A",
        SN: onu.SN,
        desc: "N/A",
        device_id: id,
      }));

      setAutofindResults(formatted);
    } catch (err) {
      console.error("Autofind failed:", err);
      setAutofindResults([]);
    }

    setLoadingAutofind(false);
  };

  // -----------------------------
  // 🔥 Handle Search
  // -----------------------------
  const handleSearch = async () => {
    console.log(searchQuery);
    // if (!searchQuery.trim()) return;

    setLoading(true);

    // Clear Autofind results
    setAutofindResults([]);

    try {
      const results = await searchONU(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }

    setLoading(false);
  };

  // Navigate from search table
  const handleRowClick = (onu) => {
    navigate(`/device/${id}/onu/${onu.SN}`, {
      state: { onu, device: { id, name, ip } },
    });
  };

  // Navigate from autofind table
  const handleAutofindRowClick = (onu) => {
    navigate(`/device/${id}/add`, {
      state: { onu, device: { id, name, ip } },
    });
  };

  return (
    <div className="p-6 text-white">
      {/* ---------------- Device Info ---------------- */}
      <h1 className="text-3xl font-bold mb-2">{name || "Device Name"}</h1>
      <p className="text-gray-400 mb-4">IP: {ip || "Device IP"}</p>

      {/* ---------------- Autofind + Search Bar ---------------- */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleAutofind}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold transition"
        >
          {loadingAutofind ? "Autofinding..." : "Autofind"}
        </button>

        <input
          type="text"
          placeholder="Search by SN or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-l bg-[#1b1b1b] border border-gray-700 
                     focus:outline-none focus:border-green-400"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-r text-white transition"
        >
          <FaSearch />
        </button>
      </div>

      {/* ---------------- Autofind Table ---------------- */}
      {loadingAutofind ? (
        <p>Loading Autofind results...</p>
      ) : autofindResults.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Autofind Results</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-700">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="px-4 py-2 border-b">FSP</th>
                  <th className="px-4 py-2 border-b">ONTID</th>
                  <th className="px-4 py-2 border-b">SN</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Device ID</th>
                </tr>
              </thead>

              <tbody>
                {autofindResults.map((onu, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-900 cursor-pointer transition"
                    onClick={() => handleAutofindRowClick(onu)}
                  >
                    <td className="px-4 py-2 border-b">{onu.FSP}</td>
                    <td className="px-4 py-2 border-b">{onu.ONTID}</td>
                    <td className="px-4 py-2 border-b break-all">{onu.SN}</td>
                    <td className="px-4 py-2 border-b">{onu.desc}</td>
                    <td className="px-4 py-2 border-b">{onu.device_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* ---------------- Search Table ---------------- */}
      {loading ? (
        <p>Searching...</p>
      ) : searchResults.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-700">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="px-4 py-2 border-b">FSP</th>
                  <th className="px-4 py-2 border-b">ONTID</th>
                  <th className="px-4 py-2 border-b">SN</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Device ID</th>
                </tr>
              </thead>

              <tbody>
                {searchResults.map((onu, idx) => (
                  <tr
                    key={idx}
                    onClick={() => handleRowClick(onu)}
                    className="hover:bg-gray-900 cursor-pointer transition"
                  >
                    <td className="px-4 py-2 border-b">{onu.FSP}</td>
                    <td className="px-4 py-2 border-b">{onu.ONTID}</td>
                    <td className="px-4 py-2 border-b break-all">{onu.SN}</td>
                    <td className="px-4 py-2 border-b">{onu.desc}</td>
                    <td className="px-4 py-2 border-b">{onu.device_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* ---------------- No Results ---------------- */}
      {searchResults.length === 0 &&
        autofindResults.length === 0 &&
        !loading &&
        !loadingAutofind && <p>No ONUs found.</p>}
    </div>
  );
};

export default DevicePage;
