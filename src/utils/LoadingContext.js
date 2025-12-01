// src/contexts/LoadingContext.js
import React, { createContext, useContext, useState } from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({
    open: false,
    message: "加载中...",
  });

  const showLoading = (message) => {
    console.log(message);
    
    setLoading({ open: true, message });
  };

  const hideLoading = () => {
    setLoading({ open: false, message: "加载中..." });
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        open={loading.open}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {loading.message}
        </Typography>
      </Backdrop>
    </LoadingContext.Provider>
  );
};
