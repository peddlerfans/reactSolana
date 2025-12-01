import { useState } from "react";
import { apiService } from "../utils/apiService";
import { useWallet } from "@solana/wallet-adapter-react";
export const useWithdraw = () => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { connected, publicKey } = useWallet();

  const getWalletAddress = () => {
    // 方式1: Phantom 钱包
    if (window.solana && window.solana.publicKey) {
      return window.solana.publicKey.toString();
    }

    // 方式2: Backpack 或其他 Solana 钱包
    if (window.backpack && window.backpack.publicKey) {
      return window.backpack.publicKey.toString();
    }

    // 方式3: 如果你使用了 @solana/wallet-adapter
    if (window.solanaWallet && window.solanaWallet.publicKey) {
      return window.solanaWallet.publicKey.toString();
    }
    if (connected && publicKey) {
      return publicKey.toString();
    }
    // throw new Error("请先连接 Solana 钱包");
  };

  const withdraw = async (type) => {
    setIsWithdrawing(true);

    try {
      // const walletAddress = getWalletAddress();
      const transaction = await apiService.withDraw.withDraw({ type });

      console.log("提现成功");
      return transaction;
    } catch (error) {
      console.error("提现失败:", error);
      throw error;
    } finally {
      setIsWithdrawing(false);
    }
  };

  return {
    isWithdrawing,
    withdraw,
  };
};
