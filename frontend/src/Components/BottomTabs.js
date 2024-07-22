import React from 'react';
import { AiOutlineDashboard, AiOutlineSetting } from 'react-icons/ai';
import { GiCarKey } from 'react-icons/gi';
import { FiNavigation } from 'react-icons/fi';
import { MdPhone, MdOutlinePermMedia } from 'react-icons/md';

function BottomTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-around items-center p-4 bg-secondary text-white fixed bottom-0 inset-x-0 h-16 border-t border-tertiary z-50"> 
      <button 
        className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-500'} transition duration-300`} 
        onClick={() => setActiveTab('dashboard')}
      >
        <AiOutlineDashboard className="text-xl md:text-2xl" />
        <span className="text-xs hidden md:block pb-1">Dashboard</span>
        <div className={`w-full h-0.5 ${activeTab === 'dashboard' ? 'bg-blueColorLight animate-expand' : 'bg-transparent'}`}></div>
      </button>
      <button 
        className={`flex flex-col items-center ${activeTab === 'quick-controls' ? 'text-white' : 'text-gray-500'} transition duration-300`} 
        onClick={() => setActiveTab('quick-controls')}
      >
        <GiCarKey className="text-xl md:text-2xl" />
        <span className="text-xs hidden md:block pb-1">Quick Controls</span>
        <div className={`w-full h-0.5 ${activeTab === 'quick-controls' ? 'bg-blueColorLight animate-expand' : 'bg-transparent'}`}></div>
      </button>
      <button 
        className={`flex flex-col items-center ${activeTab === 'navigation' ? 'text-white' : 'text-gray-500'} transition duration-300`} 
        onClick={() => setActiveTab('navigation')}
      >
        <FiNavigation className="text-xl md:text-2xl" />
        <span className="text-xs hidden md:block pb-1">Navigation</span>
        <div className={`w-full h-0.5 ${activeTab === 'navigation' ? 'bg-blueColorLight animate-expand' : 'bg-transparent'}`}></div>
      </button>
      <button 
        className={`flex flex-col items-center ${activeTab === 'phone' ? 'text-white' : 'text-gray-500'} transition duration-300`} 
        onClick={() => setActiveTab('phone')}
      >
        <MdPhone className="text-xl md:text-2xl" />
        <span className="text-xs hidden md:block pb-1">Phone</span>
        <div className={`w-full h-0.5 ${activeTab === 'phone' ? 'bg-blueColorLight animate-expand' : 'bg-transparent'}`}></div>
      </button>
      <button 
        className={`flex flex-col items-center ${activeTab === 'media' ? 'text-white' : 'text-gray-500'} transition duration-300`} 
        onClick={() => setActiveTab('media')}
      >
        <MdOutlinePermMedia className="text-xl md:text-2xl" />
        <span className="text-xs hidden md:block pb-1">Media</span>
        <div className={`w-full h-0.5 ${activeTab === 'media' ? 'bg-blueColorLight animate-expand' : 'bg-transparent'}`}></div>
      </button>
      <button 
        className={`flex flex-col items-center ${activeTab === 'settings' ? 'text-white' : 'text-gray-500'} transition duration-300`} 
        onClick={() => setActiveTab('settings')}
      >
        <AiOutlineSetting className="text-xl md:text-2xl" />
        <span className="text-xs hidden md:block pb-1">Settings</span>
        <div className={`w-full h-0.5 ${activeTab === 'settings' ? 'bg-blueColorLight animate-expand' : 'bg-transparent'}`}></div>
      </button>
    </div>
  );
}

export default BottomTabs;
