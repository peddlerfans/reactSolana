// useTransfer.js
import { useState } from "react";
import { useBalanceCheck } from "./useBalanceCheck";
import { apiService } from "../utils/apiService";
import config from "../common/config.json";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useSnackbar } from "../utils/SnackbarContext";
import { useTranslation } from "react-i18next";
export const useTransfer = () => {
  const [isTransferring, setIsTransferring] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);
  const { checkBalanceSufficient, checkingBalance } = useBalanceCheck();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  // 检查 SOL 余额是否足够支付 Gas 费用
  const checkSOLBalance = async (userPubkey) => {
    try {
      const connection = new Connection(config.network);
      const balance = await connection.getBalance(new PublicKey(userPubkey));
      const solBalance = balance / LAMPORTS_PER_SOL;

      // 建议至少 0.01 SOL 用于 Gas 费用
      const minRequiredSOL = 0.01;

      if (solBalance < minRequiredSOL) {
        showSnackbar(t("error.text5"), "error");
        const error = new Error(
          `SOL 余额不足，请确保至少有 ${minRequiredSOL} SOL 用于支付 Gas 费用。当前余额: ${solBalance.toFixed(
            4
          )} SOL`
        );
        error.code = "INSUFFICIENT_SOL_BALANCE";
        error.currentBalance = solBalance;
        error.requiredBalance = minRequiredSOL;
        // throw error;
      }

      return {
        solBalance,
        isSufficient: solBalance >= minRequiredSOL,
      };
    } catch (error) {
      console.error("检查 SOL 余额失败:", error);
      throw error;
    }
  };

  const transfer = async (amount, userPubkey) => {
    setIsTransferring(true);
    setTransactionData(null);
    setError(null);

    try {
      // 参数验证
      if (!amount || !userPubkey) {
        showSnackbar(t("error.text6"), "error");

        throw new Error("缺少必要的交易参数");
      }

      // 检查 SOL 余额（Gas 费用）
      console.log("检查 SOL 余额...");
      const solBalanceCheck = await checkSOLBalance(userPubkey);
      console.log(solBalanceCheck);

      if (!solBalanceCheck.isSufficient) {
        showSnackbar(t("error.text5"), "error");
        // return
        throw new Error(`SOL 余额不足: ${solBalanceCheck.solBalance}`);
      }

      // 前端代币余额检查
      console.log("检查代币余额...");
      const balanceCheck = await checkBalanceSufficient(
        config.TRUMP_MINT,
        userPubkey,
        amount
      );

      if (!balanceCheck.isSufficient) {
        showSnackbar(t("error.text11"), "error");
        const error = new Error(`代币余额不足`);
        error.code = "INSUFFICIENT_TOKEN_BALANCE";
        error.balanceInfo = balanceCheck;
        throw error;
      }

      // 调用交易接口
      const result = await apiService.user.transferIn({ amount, userPubkey });
      console.log(result);

      if (!result.data) {
        showSnackbar(t("error.text7"), "error");
        // return
        throw new Error("交易接口返回空数据");
      }

      // 验证返回的交易数据
      if (
        !result.data.transactions ||
        !Array.isArray(result.data.transactions)
      ) {
        showSnackbar(t("error.text8"), "error");
        // return
        throw new Error("交易数据格式错误");
      }

      // 检查每个交易的区块哈希信息
      for (const [index, tx] of result.data.transactions.entries()) {
        if (!tx.txBase64) {
          // return
          throw new Error(`第 ${index + 1} 笔交易缺少 txBase64 数据`);
        }
        if (!tx.blockhash) {
          // return
          throw new Error(`第 ${index + 1} 笔交易缺少区块哈希信息`);
        }
        if (!tx.lastValidBlockHeight) {
          // return
          throw new Error(`第 ${index + 1} 笔交易缺少最后有效区块高度`);
        }
      }

      // 保存交易信息
      setTransactionData(result.data);

      console.log("交易信息获取成功:", result);
      return result;
    } catch (error) {
      console.error("交易失败:", error);

      // 根据错误类型设置用户友好的错误信息
      let userFriendlyError = error.message;
      if (error.code === "INSUFFICIENT_SOL_BALANCE") {
        userFriendlyError = `SOL 余额不足 ⚠️\n请确保钱包中有至少 0.01 SOL 用于支付网络费用\n当前余额: ${error.currentBalance.toFixed(
          4
        )} SOL`;
      } else if (error.code === "INSUFFICIENT_TOKEN_BALANCE") {
        userFriendlyError = `代币余额不足 ⚠️\n无法完成转账操作`;
      }

      setError(userFriendlyError);
      throw error;
      // throw { ...error, userFriendlyMessage: userFriendlyError };
    } finally {
      setIsTransferring(false);
    }
  };

  const clearTransactionData = () => {
    setTransactionData(null);
    setError(null);
  };

  const retryTransfer = () => {
    clearTransactionData();
  };

  return {
    isTransferring,
    transactionData,
    error,
    transfer,
    clearTransactionData,
    retryTransfer,
  };
};
