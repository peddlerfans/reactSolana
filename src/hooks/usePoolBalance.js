// hooks/usePoolBalance.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const usePoolBalance = (poolType, level = null) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取奖池类型名称
  const getPoolTypeName = (type) => {
    const typeMap = {
      1: "静态分红",
      2: "团队奖励",
      3: "团队等级奖励",
      4: "大单奖励",
      5: "新增奖",
      6: "永动奖",
      7: "NFT奖励",
    };
    return typeMap[type] || "未知奖池";
  };

  // 获取奖池余额
  const fetchPoolBalance = useCallback(
    async (type = poolType, userLevel = level) => {
      console.log(type, userLevel);

      try {
        setLoading(true);
        setError(null);

        // 构建请求参数
        const requestData = { type };

        // 如果是团队等级奖励，需要level参数
        if (type === 3) {
          if (!userLevel) {
            throw new Error("查询团队等级奖励需要level参数");
          }
          requestData.level = userLevel;
        }
        const response = await apiService.earnings.searchReward(requestData);

        // 假设返回格式: { code: 200, data: { amount: 1000 } }
        setBalance(response.data);

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          `获取${getPoolTypeName(poolType)}奖池余额失败`;
        setError(errorMessage);
        console.error(`获取${getPoolTypeName(poolType)}奖池余额失败:`, err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [poolType, level]
  );

  // 刷新数据
  const refetch = useCallback(async () => {
    return await fetchPoolBalance();
  }, [fetchPoolBalance]);

  // 改变奖池类型
  const changePoolType = useCallback(
    async (newType, newLevel = null) => {
      return await fetchPoolBalance(newType, newLevel);
    },
    [fetchPoolBalance]
  );

  // 初始化加载
  useEffect(() => {
    // 如果是团队等级奖励但没有level，先不请求
    // if (poolType === 3 && !level) {
    //   setLoading(false);
    //   setError("查询团队等级奖励需要level参数");
    //   return;
    // }

    fetchPoolBalance();
  }, []);

  // 当poolType或level变化时重新获取
  useEffect(() => {
    // if (poolType === 3 && !level) {
    //   setError("查询团队等级奖励需要level参数");
    //   return;
    // }

    fetchPoolBalance();
  }, [poolType, level]);

  return {
    // 数据
    balance,
    balanceAmount: balance?.amount || balance?.balance || 0, // 便捷访问余额

    // 加载状态
    loading,
    error,

    // 类型信息
    poolType,
    poolTypeName: getPoolTypeName(poolType),

    // 操作方法
    refetch,
    changePoolType,
    fetchPoolBalance,
  };
};
