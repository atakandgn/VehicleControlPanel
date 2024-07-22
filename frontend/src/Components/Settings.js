import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import axiosInstance from "../axiosInstance";
import { FaCar, FaFan, FaLaptopCode } from "react-icons/fa";
import { PiHeadlightsThin, PiHeadlightsFill } from "react-icons/pi";
import { RiSteering2Line } from "react-icons/ri";
import { GiCarSeat } from "react-icons/gi";
import { GrServices } from "react-icons/gr";
import { MdOutlineDisplaySettings } from "react-icons/md";
import carView from "../Assets/carImage.webp";
import CustomSlider from "../Components/Slider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../Components/ConfirmationModal";
import Preloader from "./Preloader";

const settingsIcons = {
  Car: FaCar,
  Driving: RiSteering2Line,
  Seating: GiCarSeat,
  Air: FaFan,
  Lights: PiHeadlightsFill,
  Display: MdOutlineDisplaySettings,
  Services: GrServices,
  Software: FaLaptopCode,
};

const Settings = forwardRef(({ setSettingsChanged }, ref) => {
  const [selected, setSelected] = useState("lights");
  const [selectedHeadlight, setSelectedHeadlight] = useState();
  const [selectedFoglights, setSelectedFoglights] = useState({
    frontFog: 0,
    backFog: 0,
  });
  const [menuItems, setMenuItems] = useState([]);
  const [headlightItems, setHeadlightItems] = useState([]);
  const [angle, setAngle] = useState(45);
  const [initialSettings, setInitialSettings] = useState({
    selectedHeadlight: null,
    selectedFoglights: { frontFog: 0, backFog: 0 },
    angle: 45,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          "/VehicleSettings/GetSettingsTitles"
        );
        if (response.data && response.data.status === 200) {
          setMenuItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
      setIsLoading(false);
    };

    const fetchHeadlightItems = async () => {
      try {
        const response = await axiosInstance.get(
          "/VehicleSettings/GetHeadlightsData"
        );
        if (response.data && response.data.status === 200) {
          setHeadlightItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching headlight items:", error);
      }
    };

    const fetchUserSettings = async () => {
      try {
        const response = await axiosInstance.get(
          "/VehicleSettings/GetUserVehicleSettings"
        );
        if (response.data && response.data.status === 200) {
          const settings = response.data.settings;
          setSelectedHeadlight(settings.headlightsId);
          setSelectedFoglights({
            frontFog: settings.foglights.frontFog,
            backFog: settings.foglights.backFog,
          });
          setAngle(settings.headlightAngle);
          setInitialSettings({
            selectedHeadlight: settings.headlightsId,
            selectedFoglights: {
              frontFog: settings.foglights.frontFog,
              backFog: settings.foglights.backFog,
            },
            angle: settings.headlightAngle,
          });
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      }
    };

    fetchMenuItems();
    fetchHeadlightItems();
    fetchUserSettings();
  }, []);

  const toggleFoglight = (foglightType) => {
    setSelectedFoglights((prevSelected) => {
      const newFoglights = {
        ...prevSelected,
        [foglightType]: prevSelected[foglightType] === 1 ? 0 : 1,
      };
      setSettingsChanged(true);
      return newFoglights;
    });
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(
        "/VehicleSettings/UpdateVehicleSettings",
        {
          headlightsId: selectedHeadlight,
          foglights: [selectedFoglights.frontFog, selectedFoglights.backFog],
          headlightAngle: angle,
        }
      );
      if (response.data && response.data.status === 200) {
        toast.success("Settings updated successfully!");
        setInitialSettings({
          selectedHeadlight,
          selectedFoglights,
          angle,
        });
        setSettingsChanged(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings.");
    }
  };

  const resetSettings = () => {
    setSelectedHeadlight(initialSettings.selectedHeadlight);
    setSelectedFoglights(initialSettings.selectedFoglights);
    setAngle(initialSettings.angle);
    setSettingsChanged(false);
  };

  useImperativeHandle(ref, () => ({
    handleSave,
    resetSettings,
  }));

  const getShadowClassHL = () => {
    let shadowClass = "";
    switch (selectedHeadlight) {
      case 2: // Parking
        shadowClass +=
          " drop-shadow-[0_-30px_10px_rgba(137,196,224,0.2)] animate-pulse-once";
        break;
      case 3: // On
        shadowClass +=
          " drop-shadow-[0_-37px_10px_rgba(137,196,224,0.3)] animate-pulse-once";
        break;
      case 4: // Auto
        shadowClass +=
          " drop-shadow-[0_-40px_10px_rgba(137,196,224,0.35)] animate-pulse-once";
        break;
      default: // Off
        break;
    }
    return shadowClass.trim();
  };

  const getFogLightClass = (position) => {
    if (selectedFoglights[position]) {
      return "animate-pulse-once";
    }
    return "";
  };

  return (
    <div className="flex flex-col text-textColor gap-2 md:px-4 px-2">
      <div className="flex gap-4 flex-row">
        <div className="w-full lg:w-1/4 w-max bg-primary sm:p-4 py-2 rounded-xl border border-tertiary ">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Preloader />
            </div>
          ) : (
            <ul className="flex flex-col gap-4 sm:p-1 p-2">
              <h2 className="sm:text-3xl text-base pb-4 ">Settings</h2>
              {menuItems.map((item) => {
                const Icon = settingsIcons[item.title];
                return (
                  <li
                    key={item.id}
                    className={`flex items-center sm:justify-start justify-center gap-2 sm:py-2 sm:px-5 p-3 rounded-full cursor-pointer border transition duration-300 ${
                      selected === item.title.toLowerCase()
                        ? "bg-secondary text-white border-tertiary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelected(item.title.toLowerCase())}
                  >
                    <Icon
                      className={`text-xl transition duration-300 ${
                        selected === item.title.toLowerCase()
                          ? "text-yellow-400"
                          : ""
                      }`}
                    />
                    <span className="hidden sm:block">{item.title}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex flex-col lg:w-3/4 w-full bg-secondary p-4 rounded-xl border border-tertiary">
          <h3 className="text-2xl">Lights</h3>
          <div className="flex sm:flex-row flex-col gap-4 my-4 items-center">
            <div className="flex flex-col gap-6 my-4 sm:w-1/2">
              <div className="flex flex-col gap-2">
                <div>Headlights</div>
                <div className="flex flex-wrap gap-2 ">
                  {headlightItems.map((item) => (
                    <button
                      key={item.id}
                      className={`px-4 py-2 rounded hover:bg-hoverLightBlue transition duration-300 ${
                        selectedHeadlight === item.id
                          ? "bg-lightBlue text-white"
                          : "bg-gray-700"
                      }`}
                      onClick={() => {
                        setSelectedHeadlight(item.id);
                        setSettingsChanged(true);
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Fog Lights</div>
                <div className="flex gap-2 flex-wrap ">
                  <button
                    className={`flex flex-row items-center justify-center gap-2 px-4 py-2 rounded hover:bg-hoverLightBlue transition duration-300 ${
                      selectedFoglights.frontFog === 1
                        ? "bg-lightBlue text-white"
                        : "bg-gray-700"
                    }`}
                    onClick={() => toggleFoglight("frontFog")}
                  >
                    <PiHeadlightsThin className="w-5 h-5 rotate-180" />
                    <span>Front Fog</span>
                  </button>
                  <button
                    className={`flex flex-row items-center justify-center gap-2 px-4 py-2 rounded hover:bg-hoverLightBlue transition duration-300 ${
                      selectedFoglights.backFog === 1
                        ? "bg-lightBlue text-white"
                        : "bg-gray-700"
                    }`}
                    onClick={() => toggleFoglight("backFog")}
                  >
                    <PiHeadlightsThin className="w-5 h-5" />
                    <span>Back Fog</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div>
                  Angle: <span>{angle} °</span>
                </div>
                <CustomSlider
                  value={angle}
                  onChange={(e) => {
                    setAngle(Number(e.target.value));
                    setSettingsChanged(true);
                  }}
                  min={10}
                  max={100}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-lightBlue text-white rounded hover:bg-hoverLightBlue transition duration-300"
              >
                Save Settings
              </button>
            </div>
            <div className="relative flex sm:w-1/2 w-full h-60 items-center justify-center sm:pt-0 py-8 ">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  className={`w-full h-60 md:w-[250px] md:h-[300px] sm:w-[200px] sm:h-[240px] object-contain ${getShadowClassHL()}`}
                  src={carView}
                  alt="Car Settings"
                />
                <div className="absolute w-full h-full">
                  {selectedFoglights.frontFog ? (
                    <>
                      <div
                        className={`absolute -top-9 left-[calc(50%-50px)] w-5 h-5 blur-lg opacity-70 bg-white rounded-full ${getFogLightClass(
                          "frontFog"
                        )}`}
                      ></div>
                      <div
                        className={`absolute -top-9 right-[calc(50%-40px)] w-5 h-5 blur-lg opacity-70 bg-white rounded-full ${getFogLightClass(
                          "frontFog"
                        )}`}
                      ></div>
                    </>
                  ) : null}
                  {selectedFoglights.backFog ? (
                    <>
                      <div
                        className={`absolute -bottom-9 left-[calc(50%-50px)] w-5 h-5 blur-lg opacity-70 bg-orange-500 rounded-full ${getFogLightClass(
                          "backFog"
                        )}`}
                      ></div>
                      <div
                        className={`absolute -bottom-9 right-[calc(50%-40px)] w-5 h-5 blur-lg opacity-70 bg-orange-500 rounded-full ${getFogLightClass(
                          "backFog"
                        )}`}
                      ></div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSave}
      />
      <ToastContainer />
    </div>
  );
});

export default Settings;
