import React, { useState, useRef, useEffect } from "react";
import BottomTabs from "../Components/BottomTabs";
import Navbar from "../Components/Navbar";
import Navigation from "../Components/Navigation";
import Settings from "../Components/Settings";
import ConfirmationModal from "../Components/ConfirmationModal";

function MainLayout({ isAuth, children }) {
  const [activeTab, setActiveTab] = useState("settings");
  const [settingsChanged, setSettingsChanged] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [nextTab, setNextTab] = useState("");
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);
  const settingsRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCurrentLatitude(latitude);
      setCurrentLongitude(longitude);
    });
  }, []);

  const handleTabChange = (tab) => {
    if (settingsChanged) {
      setNextTab(tab);
      setIsUnsavedModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const confirmUnsavedChanges = () => {
    if (settingsRef.current) {
      settingsRef.current.handleSave();
    }
    setIsUnsavedModalOpen(false);
  };

  const discardUnsavedChanges = () => {
    if (settingsRef.current) {
      settingsRef.current.resetSettings();
    }
    setSettingsChanged(false);
    setActiveTab(nextTab);
    setIsUnsavedModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "navigation":
        return <Navigation currentLatitude={currentLatitude} currentLongitude={currentLongitude} />;
      case "settings":
      default:
        return <Settings ref={settingsRef} setSettingsChanged={setSettingsChanged} />;
    }
  };

  return (
    <div className="min-h-[100vh] bg-primary text-white flex flex-col overflow-hidden">
      <Navbar latitude={currentLatitude} longitude={currentLongitude} />
      {isAuth ? (
        <div className="flex-1 pt-[75px] sm:pb-0 pb-[75px] ">
          {renderContent()}
          <BottomTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 pt-[75px]">
          {children}
        </div>
      )}
      <ConfirmationModal
        isOpen={isUnsavedModalOpen}
        onClose={discardUnsavedChanges}
        onConfirm={confirmUnsavedChanges}
        text="You have unsaved changes. Do you want to save them before leaving?"
      />
    </div>
  );
}

export default MainLayout;
