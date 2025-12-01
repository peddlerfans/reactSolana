import React, { createContext, useContext, useState } from "react";

const WalletReadyContext = createContext({
  walletReady: false,
  setWalletReady: (v: boolean) => {},
});

export const WalletReadyProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [walletReady, setWalletReady] = useState(false);
  return (
    <WalletReadyContext.Provider value={{ walletReady, setWalletReady }}>
      {children}
    </WalletReadyContext.Provider>
  );
};

export const useWalletReady = () => useContext(WalletReadyContext);
