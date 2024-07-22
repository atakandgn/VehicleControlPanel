import React, { useState, useEffect } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiTornado,
} from "react-icons/wi";
import { AiOutlineWifi } from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { BsBatteryHalf, BsBluetooth } from "react-icons/bs";
import { getDecodedToken } from "../utils/jwtDecode";
import Clock from "./Clock";
import axios from "axios";
import Preloader from "./Preloader";


function Navbar({ latitude, longitude }) {
  const decodedToken = getDecodedToken();
  const userName = decodedToken ? decodedToken.FirstName : null;

  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);
  const fetchWeather = async (lat, lon) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
      const currentDate = new Date(response.data.dt * 1000).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
      setDate(currentDate);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <WiDaySunny className="text-yellow-400 xs:w-5 xs:h-5 w-4 h-4" />;
      case "Clouds":
        return <WiCloudy className="text-gray-400 xs:w-5 xs:h-5 w-4 h-4" />;
      case "Rain":
        return <WiRain className="text-blue-400 xs:w-5 xs:h-5 w-4 h-4" />;
      case "Snow":
        return <WiSnow className="text-white xs:w-5 xs:h-5 w-4 h-4" />;
      case "Thunderstorm":
        return <WiThunderstorm className="text-yellow-400 xs:w-5 xs:h-5 w-4 h-4" />;
      case "Fog":
        return <WiFog className="text-gray-400 xs:w-5 xs:h-5 w-4 h-4" />;
      case "Tornado":
        return <WiTornado className="text-yellow-400 xs:w-5 xs:h-5 w-4 h-4" />;
      default:
        return <WiDaySunny className="text-yellow-400 xs:w-5 xs:h-5 w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-secondary bg-opacity-50 backdrop-blur-sm text-white z-50">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="fixed top-0 w-full flex justify-between items-center xs:p-4 p-3 bg-secondary text-white z-10 border-b border-tertiary z-50">
      <div className="flex items-center gap-2 xs:text-base text-sm break-word">
        <span>{date}</span>
        {weather && (
          <>
            {getWeatherIcon(weather.weather[0].main)}
            <span>{Math.round(weather.main.temp)}°C</span>
          </>
        )}
      </div>
      <div className="text-center">
        <Clock />
      </div>
      {userName ? (
        <div className="flex items-center gap-2">
          <CiUser className="xs:w-5 xs:h-5 w-4 h-4" />
          <span className="xs:block hidden">{userName}</span>
          <AiOutlineWifi className="xs:w-5 xs:h-5 w-4 h-4" />
          <BsBluetooth className="xs:w-5 xs:h-5 w-4 h-4" />
          <BsBatteryHalf className="xs:w-5 xs:h-5 w-4 h-4" />
        </div>
      ) : (
        <div className="sm:flex hidden items-center justify-center gap-2">
          <span >Login to access your panel.</span>
          <BsBatteryHalf className="xs:w-5 xs:h-5 w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export default Navbar;
