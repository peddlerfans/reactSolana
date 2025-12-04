import { useState, useCallback, useEffect } from "react";
import { useSnackbar } from "../utils/SnackbarContext";
import { useTranslation } from "react-i18next";
import { apiService } from "../utils/apiService";

export const useIncome = (incomeType, defaultPage = 1, defaultSize = 10) => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // 新增：专门用于加载更多的状态
  const [error, setError] = useState(null);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();
  
  const [pagination, setPagination] = useState({
    page: defaultPage,
    size: defaultSize,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // ✅ 统一的数据获取函数，类似 useUserInfo 的 fetchRecords
  const fetchIncomeData = useCallback(
    async (
      type = incomeType,
      page = 1,
      size = defaultSize,
      isLoadMore = false
    ) => {
      try {
        // 设置正确的加载状态
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        if (!type) {
          showSnackbar(t("hooks.text1"), "error");
          throw new Error("查询NFT收益需要type参数");
        }

        const response = await apiService.nft.nftIncome({
          type,
          page,
          size,
        });

        const responseData = response.data || {};
        const listData = responseData?.list || responseData?.data || responseData || [];
        const total = responseData?.total || listData.length || 0;
        const totalPages = Math.ceil(total / size);
        
        // ✅ 关键：根据 isLoadMore 决定是替换还是追加数据
        if (isLoadMore) {
          // 加载更多：追加数据
          setIncomeData(prev => [...prev, ...listData]);
        } else {
          // 初始加载：替换数据
          setIncomeData(listData);
        }

        // 更新分页信息
        setPagination({
          page,
          size,
          total,
          totalPages,
          hasMore: listData.length >= size,
        });

        return {
          list: listData,
          total,
          page,
          size,
        };
      } catch (err) {
        const errorMessage = err.response?.data?.message || "获取NFT收益失败";
        setError(errorMessage);
        showSnackbar(t("hooks.text2") + errorMessage, "error");
        throw err;
      } finally {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [incomeType, defaultSize, showSnackbar, t]
  );

  // ✅ 加载更多（类似 useUserInfo 的 loadMore）
  const loadMore = useCallback(async () => {
    if (loadingMore || !pagination.hasMore) return;
    await fetchIncomeData(incomeType, pagination.page + 1, pagination.size, true);
  }, [loadingMore, pagination, incomeType, fetchIncomeData]);

  // ✅ 刷新数据（回到第一页）
  const refetch = useCallback(async () => {
    await fetchIncomeData(incomeType, 1, pagination.size, false);
  }, [incomeType, pagination.size, fetchIncomeData]);

  // ✅ 改变收益类型（重置到第一页）
  const changeIncomeType = useCallback(
    async (newType) => {
      await fetchIncomeData(newType, 1, pagination.size, false);
    },
    [pagination.size, fetchIncomeData]
  );

  // ✅ 初始加载
  useEffect(() => {
    if (incomeType) {
      fetchIncomeData(incomeType, 1, defaultSize, false);
    }
  }, [incomeType, defaultSize, fetchIncomeData]);

  return {
    // 数据
    incomeData,
    
    // 分页信息
    pagination,
    
    // 加载状态
    loading,          // 初始加载状态
    loadingMore,      // 加载更多状态
    error,
    
    // 操作方法
    fetchIncomeData: (type, page, size) => fetchIncomeData(type, page, size, false), // 对外暴露时不带 isLoadMore
    loadMore,
    refetch,
    changeIncomeType,
    
    // 便捷状态
    hasMore: pagination.hasMore,
    isEmpty: incomeData.length === 0,
    totalCount: pagination.total,
  };
};