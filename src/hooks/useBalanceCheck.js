import { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSnackbar } from "../utils/SnackbarContext";
import { useTranslation } from "react-i18next";
export const useBalanceCheck = () => {
  const [checkingBalance, setCheckingBalance] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const getTokenBalance = async (mintAddress, userAddress) => {
    try {
      const connection = new Connection(
        "https://devnet.helius-rpc.com/?api-key=7faaa130-4d5c-4b24-b37c-6ff5aaf9accb"
      );

      const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey(userAddress),
        { mint: new PublicKey(mintAddress) }
      );
      console.log("tokenAccounts", tokenAccounts);

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      const balance = await connection.getTokenAccountBalance(
        tokenAccounts.value[0].pubkey
      );
      console.log("banlance", balance);

      return parseFloat(balance.value.uiAmount) || 0;
    } catch (error) {
      showSnackbar(t("sign.text7") + error, "error");
      //   throw error;
    }
  };

  const checkBalanceSufficient = async (
    mintAddress,
    userAddress,
    requiredAmount
  ) => {
    setCheckingBalance(true);

    try {
      const currentBalance = await getTokenBalance(mintAddress, userAddress);
      const isSufficient = currentBalance >= parseFloat(requiredAmount);

      return {
        isSufficient,
        currentBalance,
        requiredAmount: parseFloat(requiredAmount),
        shortfall: isSufficient
          ? 0
          : parseFloat(requiredAmount) - currentBalance,
      };
    } catch (error) {
      showSnackbar(t("sign.text8") + error, "error");
      //   throw error;
    } finally {
      setCheckingBalance(false);
    }
  };

  return {
    checkingBalance,
    getTokenBalance,
    checkBalanceSufficient,
  };
};
