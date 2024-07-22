import React from "react";
import MainLayout from "../layout/MainLayout";

export default function Home() {
  const isAuth = true; 

  return (
    <MainLayout isAuth={isAuth} />
  );
}
