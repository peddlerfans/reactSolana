// hooks/useWithdrawList.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const useWithdrawList = (
  withdrawType,
  defaultPage = 1,
  defaultSize = 10
) => {
  const [withdrawData, setWithdrawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    size: defaultSize,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // 获取提现类型的中文名称
  const getWithdrawTypeText = (type) => {
    const typeMap = {
      1: "静态分红",
      2: "团队奖励",
      3: "团队等级奖励",
      4: "大单奖励",
      5: "新增奖",
      6: "永动奖",
      7: "NFT奖",
    };
    return typeMap[type] || "提现记录";
  };

  // 获取提现记录
  const fetchWithdrawList = useCallback(
    async (
      type = withdrawType,
      page = pagination.page,
      size = pagination.size
    ) => {
      try {
        setLoading(true);
        setError(null);

        // 验证type参数
        // if (!type) {
        //   throw new Error("查询提现记录需要type参数");
        // }

        const response = await apiService.withDraw.getList({
          type,
          page,
          size,
        });

        const responseData = response.data;
        const listData = responseData?.list || responseData?.data || [];
        const total = responseData?.total || listData.length || 0;
        const totalPages = Math.ceil(total / size);

        setWithdrawData(responseData);
        setPagination({
          page,
          size,
          total,
          totalPages,
          hasMore: page < totalPages,
        });

        return responseData;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          `获取${getWithdrawTypeText(withdrawType)}提现记录失败`;
        setError(errorMessage);
        console.error(
          `获取${getWithdrawTypeText(withdrawType)}提现记录失败:`,
          err
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [withdrawType, pagination.page, pagination.size]
  );

  // 改变提现类型
  const changeWithdrawType = useCallback(
    async (newType) => {
      await fetchWithdrawList(newType, 1, pagination.size);
    },
    [fetchWithdrawList, pagination.size]
  );

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;

    const nextPage = pagination.page + 1;
    try {
      setLoading(true);

      const newData = await fetchWithdrawList(
        withdrawType,
        nextPage,
        pagination.size
      );

      // 合并数据
      setWithdrawData((prev) => ({
        ...prev,
        ...newData,
        list: [...(prev?.list || []), ...(newData?.list || [])],
      }));
    } catch (err) {
      console.error("加载更多失败:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, withdrawType, fetchWithdrawList]);

  // 改变分页
  const changePage = useCallback(
    async (newPage, newSize = pagination.size) => {
      await fetchWithdrawList(withdrawType, newPage, newSize);
    },
    [withdrawType, fetchWithdrawList, pagination.size]
  );

  // 刷新数据
  const refetch = useCallback(async () => {
    await fetchWithdrawList(withdrawType, 1, pagination.size);
  }, [withdrawType, fetchWithdrawList, pagination.size]);

  // 初始化加载
  useEffect(() => {
    fetchWithdrawList();
    // if (withdrawType) {
    //   fetchWithdrawList();
    // } else {
    //   setLoading(false);
    //   setError("请提供提现类型参数");
    // }
  }, []);

  // 当withdrawType变化时重新获取数据
  useEffect(() => {
    if (withdrawType) {
      fetchWithdrawList(withdrawType, 1, pagination.size);
    }
  }, [withdrawType]);

  return {
    // 数据
    withdrawData,
    withdrawList: withdrawData?.list || withdrawData?.data || [],

    // 加载状态
    loading,
    error,

    // 分页信息
    pagination,

    // 类型信息
    withdrawType,

    // 操作方法
    changeWithdrawType,
    loadMore,
    changePage,
    refetch,
    fetchWithdrawList,

    // 工具函数
    getWithdrawTypeText: () => getWithdrawTypeText(withdrawType),
  };
};
