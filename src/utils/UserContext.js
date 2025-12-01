// src/contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { apiService } from "./apiService";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { connected, publicKey } = useWallet();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log("UserProvider: 开始获取用户信息", { 
        connected, 
        publicKey: publicKey?.toString(),
        hasToken: !!localStorage.getItem('token')
      });
      
      // 检查条件：已连接 + 有公钥 + 有 token
      if (!connected || !publicKey || !localStorage.getItem('token')) {
        console.log("UserProvider: 条件不满足，清除用户信息");
        setUserInfo(null);
        return;
      }

      const publicKeyStr = publicKey.toString();
      console.log("UserProvider: 开始获取用户信息，公钥:", publicKeyStr);

      setLoading(true);
      try {
        console.log("UserProvider: 调用 API 获取用户信息");
        
        // 根据你的后端 API 调整
        const res = await apiService.user.getProfile({ userPubkey: publicKeyStr });
        console.log("UserProvider: API 响应:", res);

        if (res && res.data) {
          setUserInfo(res.data);
          console.log("UserProvider: 用户信息设置成功");
        } else {
          console.warn("UserProvider: API 返回数据格式异常:", res);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("UserProvider: 获取用户信息失败:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [connected, publicKey]); // 监听连接状态和公钥变化

  // 添加对 localStorage token 变化的监听
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("UserProvider: token 变化，重新获取用户信息");
      if (connected && publicKey && localStorage.getItem('token')) {
        const fetchData = async () => {
          setLoading(true);
          try {
            const publicKeyStr = publicKey.toString();
            const res = await apiService.user.getProfile({ userPubkey: publicKeyStr });
            if (res && res.data) {
              setUserInfo(res.data);
            }
          } catch (error) {
            console.error("UserProvider: 重新获取用户信息失败:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    };

    // 监听 storage 事件
    window.addEventListener('storage', handleStorageChange);
    
    // 手动触发一次检查
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [connected, publicKey]);

  // 手动刷新用户信息
  const refreshUserInfo = () => {
    console.log("UserProvider: 手动刷新用户信息");
    if (connected && publicKey && localStorage.getItem('token')) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const publicKeyStr = publicKey.toString();
          const res = await apiService.user.getProfile({ userPubkey: publicKeyStr });
          if (res && res.data) {
            setUserInfo(res.data);
          }
        } catch (error) {
          console.error("UserProvider: 手动刷新失败:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  // 清除用户信息
  const clearUserInfo = () => {
    console.log("UserProvider: 清除用户信息");
    setUserInfo(null);
  };

  const value = {
    userInfo,
    loading,
    refreshUserInfo,
    clearUserInfo,
    isLoggedIn: !!userInfo && connected && !!localStorage.getItem('token'),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};