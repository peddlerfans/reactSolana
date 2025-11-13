// hooks/useIncome.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const useIncome = (incomeType, defaultPage = 1, defaultSize = 10) => {
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    size: defaultSize,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // 获取NFT收益
  const fetchNftIncome = useCallback(
    async (
      type = incomeType,
      page = pagination.page,
      size = pagination.size
    ) => {
      try {
        setLoading(true);
        setError(null);

        // 验证type参数
        if (!type) {
          throw new Error("查询NFT收益需要type参数");
        }

        const response = await apiService.nft.nftIncome({
          type,
          page,
          size,
        });

        const responseData = response.data;
        const listData = responseData?.list || responseData?.data || [];
        const total = responseData?.total || listData.length || 0;
        const totalPages = Math.ceil(total / size);

        setIncomeData(responseData);
        setPagination({
          page,
          size,
          total,
          totalPages,
          hasMore: size === total,
        });

        return responseData;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "获取NFT收益失败";
        setError(errorMessage);
        console.error("获取NFT收益失败:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [incomeType, pagination.page, pagination.size]
  );

  // 改变收益类型
  const changeIncomeType = useCallback(
    async (newType) => {
      await fetchNftIncome(newType, 1, pagination.size);
    },
    [fetchNftIncome, pagination.size]
  );

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;

    const nextPage = pagination.page + 1;
    try {
      setLoading(true);

      const newData = await fetchNftIncome(
        incomeType,
        nextPage,
        pagination.size
      );

      // 合并数据
      setIncomeData((prev) => ({
        ...prev,
        ...newData,
        list: [...(prev?.list || []), ...(newData?.list || [])],
      }));
    } catch (err) {
      console.error("加载更多失败:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, incomeType, fetchNftIncome]);

  // 改变分页
  const changePage = useCallback(
    async (newPage, newSize = pagination.size) => {
      await fetchNftIncome(incomeType, newPage, newSize);
    },
    [incomeType, fetchNftIncome, pagination.size]
  );

  // 刷新数据
  const refetch = useCallback(async () => {
    await fetchNftIncome(incomeType, 1, pagination.size);
  }, [incomeType, fetchNftIncome, pagination.size]);

  // 初始化加载
  useEffect(() => {
    if (incomeType) {
      fetchNftIncome();
    } else {
      setLoading(false);
      setError("请提供收益类型参数");
    }
  }, []);

  // 当incomeType变化时重新获取数据
  useEffect(() => {
    if (incomeType) {
      fetchNftIncome(incomeType, 1, pagination.size);
    }
  }, [incomeType]);

  // 获取收益类型文本
  const getIncomeTypeText = (type) => {
    const typeMap = {
      1: "静态收益",
      2: "加权收益",
      3: "团队收益",
    };
    return typeMap[type] || "未知收益";
  };

  return {
    // 数据
    incomeData,
    incomeList: incomeData?.list || incomeData?.data || [],

    // 加载状态
    loading,
    error,

    // 分页信息
    pagination,

    // 类型信息
    incomeType,

    // 操作方法
    changeIncomeType,
    loadMore,
    changePage,
    refetch,
    fetchNftIncome,

    // 工具函数
    getIncomeTypeText: () => getIncomeTypeText(incomeType),
  };
};
