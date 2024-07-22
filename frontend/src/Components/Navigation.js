import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast, ToastContainer } from "react-toastify";
import Preloader from "./Preloader";
import indicator from "../Assets/bluedot.webp";
import locationIcon from "../Assets/locationBlue.webp";
import ConfirmationModal from "./ConfirmationModal";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import axiosInstance from "../axiosInstance";

const Navigation = ({ currentLatitude, currentLongitude }) => {
  const [position, setPosition] = useState(null);
  const [route, setRoute] = useState([]);
  const [passedRoute, setPassedRoute] = useState([]);
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [startLocationName, setStartLocationName] = useState("");
  const [destinationLocationName, setDestinationLocationName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);
  const [routeIndex, setRouteIndex] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (currentLatitude && currentLongitude) {
      setPosition([currentLatitude, currentLongitude]);
      getLocationName(
        [currentLatitude, currentLongitude],
        setStartLocationName
      );
    }
  }, [currentLatitude, currentLongitude]);

  useEffect(() => {
    if (route.length > 0 && routeIndex < route.length) {
      const interval = setInterval(() => {
        setPosition(route[routeIndex]);
        setPassedRoute((prev) => [...prev, route[routeIndex]]);
        setRouteIndex((prev) => prev + 1);

        if (routeIndex === route.length - 1) {
          toast.success(
            `You have arrived at your destination: ${destinationLocationName}!`
          );
          setDestinationCoords(null);
          setDestinationLocationName("");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [route, routeIndex]);

  const icon = new L.Icon({
    iconUrl: indicator,
    iconSize: [35, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [35, 35],
  });

  const destinationIcon = new L.Icon({
    iconUrl: locationIcon,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [35, 35],
  });

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleDestinationSubmit = async () => {
    if (destination) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon, name } = data[0];
        const destCoords = [parseFloat(lat), parseFloat(lon)];
        setPendingDestination({ coords: destCoords, name: name });
        setIsModalOpen(true);
      }
    }
  };

  const confirmDestination = () => {
    if (pendingDestination) {
      const { coords, name } = pendingDestination;
      setDestinationCoords(coords);
      setDestinationLocationName(name);
      getRouteFromORS(position, coords);
      saveNavigationData(position, coords);
    }
    setIsModalOpen(false);
  };

  const getRouteFromORS = async (start, end) => {
    const apiKey = process.env.REACT_APP_LEAFLET_API_KEY;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start[1]},${start[0]}&end=${end[1]},${end[0]}`;
    const response = await fetch(url);
    const data = await response.json();
    const coordinates = data.features[0].geometry.coordinates.map((coord) => [
      coord[1],
      coord[0],
    ]);
    setRoute(coordinates);
    setPassedRoute([start]);
    setRouteIndex(0);
  };

  const getLocationName = async (coords, setName) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`
    );
    const data = await response.json();
    setName(data.name);
  };

  const saveNavigationData = async (start, end) => {
    try {
      const response = await axiosInstance.post("/users/SaveNavigation", {
        startLatitude: start[0],
        startLongitude: start[1],
        endLatitude: end[0],
        endLongitude: end[1]
      });
      if (response.data && response.data.status === 200) {
        toast.success("Navigation data saved successfully!");
      }
    } catch (error) {
      console.error("Error saving navigation data:", error);
      toast.error("Failed to save navigation data.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        getLocationName([lat, lng], (name) => {
          setPendingDestination({ coords: [lat, lng], name });
          setDestinationLocationName(name);
          setIsModalOpen(true);
        });
      },
    });

    return destinationCoords === null ? null : (
      <Marker position={destinationCoords} icon={destinationIcon}>
        <Popup>Destination Location</Popup>
        <Tooltip direction="top" offset={[10, -30]} opacity={1} permanent>
          {destinationLocationName}
        </Tooltip>
      </Marker>
    );
  };

  if (position === null) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Preloader />
      </div>
    );
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-row gap-2 sm:p-4 p-2 bg-primary border border-tertiary rounded-lg w-max absolute z-10 sm:top-[5px] top-[15px] left-12 shadow-xl">
        <input
          type="text"
          value={destination}
          onChange={handleDestinationChange}
          placeholder="Enter your destination..."
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation sm:text-base text-xs"
        />
        <button
          onClick={handleDestinationSubmit}
          className="px-4 py-2 bg-lightBlue hover:bg-hoverLightBlue text-white font-bold rounded transition duration-300 sm:text-base text-xs"
        >
          Get Route
        </button>
      </div>

      <div className="bg-primary border border-tertiary rounded-full absolute top-[100px] left-2 z-10 cursor-pointer transition duration-300">
        <button
          className="transition duration-300 transform hover:scale-110 p-2"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <MdDarkMode className="w-5 h-5 hover:text-gray-300 transition duration-300" />
          ) : (
            <MdLightMode className="w-5 h-5 hover:text-gray-300 transition duration-300" />
          )}
        </button>
      </div>
      <div id="map">
        <MapContainer
          center={position}
          zoom={50}
          style={{ height: "calc(100vh - 4rem)", width: "100%" }}
        >
          {theme === "light" ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          ) : (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          )}
          <Marker position={position} icon={icon}>
            <Popup>Current location</Popup>
          </Marker>
          <LocationMarker />
          {route.length > 0 && <Polyline positions={route} color="blue" />}
          {passedRoute.length > 0 && (
            <Polyline positions={passedRoute} color="gray" />
          )}
        </MapContainer>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDestination}
        text="Are you sure you want to set this location as your destination?"
        title="✋ Confirm Destination"
      />
      <ToastContainer />
    </div>
  );
};

export default Navigation;
