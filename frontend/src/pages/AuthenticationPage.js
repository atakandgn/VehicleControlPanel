import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthForm from "../Components/AuthForm";
import axiosInstance from "../axiosInstance";

export default function AuthenticationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/users/isAuthenticated', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            navigate("/"); 
          }
        } catch (error) {
          console.error("Authentication check failed:", error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return (
    <MainLayout isAuth={false}>
      <AuthForm />
    </MainLayout>
  );
}
