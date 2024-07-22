import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import notFound from "../Assets/notFound.svg";

export default function NotFound () {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen bg-secondary text-white">
      <div className="text-center text-xl">
        <img src={notFound} alt="Not Found" className="w-full h-full object-contain" />
        <p className='py-3'>The page you are looking for does not exist.</p>
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-400 transition duration-300 relative focus:outline-none before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[1px] before:bg-blue-400 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
        >
          <FaHome className="mr-2" />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

