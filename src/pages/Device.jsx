import React, { useEffect, useState } from "react";
import { getDevices, getDeviceStatus } from "../api/devices";
import { useNavigate } from "react-router-dom";

const Device = () => {
  const navigate = useNavigate();
  const [Device, setDevice] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDevice = async () => {
    setLoading(true);
    try {
      const data = await getDevices();
      setDevice(data);

      // Fetch status for each device
      const statuses = {};
      for (const dev of data) {
        try {
          const status = await getDeviceStatus(dev.id);
          statuses[dev.id] = status;
          console.log(dev.id);
          console.log(`Device ${dev.id} status: ${status}`);
        } catch (err) {
          statuses[dev.id] = "unknown";
        }
      }
      setStatusMap(statuses);

    } catch (err) {
      console.error("Error fetching Device:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDevice();
  }, []);

    return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Device</h1>

      <h2 className="text-xl font-semibold mb-4">Select a Device</h2>

      {loading ? (
        <p>Loading Device...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Device.map((dev) => {
            const status = statusMap[dev.id];
            const isOnline = status === "online";

            return (
              <button
                key={dev.id}
                className={`relative p-5 rounded-xl border text-left transition 
                  bg-[#1b1b1b] border-gray-700 hover:border-green-400 hover:bg-[#222]
                `}
                onClick={() => navigate(`/device/${dev.id}`, {
                    state: { name: dev.name, ip: dev.ip }, // Pass name & IP
                  })} // Navigate to DevicePage
              >
                <span
                  className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-500"
                  }`}
                ></span>

                <h3 className="text-lg font-bold">{dev.name}</h3>
                <p className="text-gray-400 text-sm">{dev.ip}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Device;