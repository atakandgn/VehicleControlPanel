import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axiosInstance';
import Preloader from './Preloader';
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    const charStr = String.fromCharCode(charCode);
    if ((e.target.name === "firstName" || e.target.name === "lastName") && !/^[a-zA-ZşŞiİıIöÖüÜçÇğĞ]+$/.test(charStr)) {
      e.preventDefault();
    }
    if (e.target.name === "phoneNumber" && !/[0-9]/.test(charStr)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const response = await axiosInstance.post('/users/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful ⭐');
        navigate('/');
      } else {
        const response = await axiosInstance.post('/users/register', formData);
        console.log('Register successful:', response.data);
        toast.success('Register successful 🎉');
        setIsLogin(true);
        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          phoneNumber: '',
          password: ''
        });
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Authentication failed ❌');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-secondary p-8 rounded-lg shadow-lg ${isLogin ? 'w-96' : 'w-[490px]'}`}>
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label className="block text-white">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation"
                  placeholder="Jhon"
                  pattern="[A-Za-zşŞiİıIöÖüÜçÇğĞ]+"
                  title="First name should only contain letters."
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-white">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation"
                  placeholder="Doe"
                  pattern="[A-Za-zşŞiİıIöÖüÜçÇğĞ]+"
                  title="Last name should only contain letters."
                  required
                />
              </div>
            </div>
            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label className="block text-white">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation"
                  placeholder="johndoe123"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-white">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation"
                  placeholder="0550 000 000"
                  required
                />
              </div>
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation"
            placeholder="example@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-0 focus:animate-focusAnimation"
            placeholder="*********"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-lightBlue hover:bg-hoverLightBlue text-white font-bold rounded transition duration-300"
          disabled={loading}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <div className="text-center mt-4 relative">
        <button
          onClick={toggleAuthMode}
          className="text-blue-400 relative transition duration-300 focus:outline-none before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[1px] before:bg-blue-400 before:transition-all before:duration-300 before:ease-in-out hover:before:w-full hover:before:left-0"
        >
          {isLogin ? 'Create an account' : 'Already have an account? Login'}
        </button>
      </div>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Preloader />
        </div>
      )}
    </div>
  );
}

export default AuthForm;
