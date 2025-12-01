// hooks/useUserInfo.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const useUserInfo = (page = 1, size = 10) => {
  const [userInfo, setUserInfo] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState({
    user: true, // 用户信息加载状态
    records: true, // 记录加载状态
    more: false, // 加载更多状态
  });
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page,
    size,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, user: true }));
      setError(null);
      const response = await apiService.user.getProfile();
      setUserInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "获取用户信息失败");
      console.error("获取用户信息失败:", err);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  }, []);

  // 获取转入记录（支持分页）
  const fetchRecords = useCallback(
    async (currentPage = 1, currentSize = size, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setLoading((prev) => ({ ...prev, more: true }));
        } else {
          setLoading((prev) => ({ ...prev, records: true }));
        }
        setError(null);

        // 只获取转入记录
        const response = await apiService.user.transferInList({
          page: currentPage,
          size: currentSize,
        });

        const recordsData = response.data || [];
        const total = response.total || 0;
        const totalPages = recordsData.length;
        
        // 如果是加载更多，就追加数据；否则替换数据
        if (isLoadMore) {
          setRecords((prev) => [...prev, ...recordsData]);
        } else {
          setRecords(recordsData);
        }

        setPagination({
          page: currentPage,
          size: currentSize,
          total,
          totalPages,
          hasMore: currentSize === totalPages,
        });
      } catch (err) {
        setError(err.response?.data?.message || "获取转入记录失败");
        console.error("获取转入记录失败:", err);
      } finally {
        if (isLoadMore) {
          setLoading((prev) => ({ ...prev, more: false }));
        } else {
          setLoading((prev) => ({ ...prev, records: false }));
        }
      }
    },
    [size]
  );

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loading.more || !pagination.hasMore) return;
    await fetchRecords(pagination.page + 1, pagination.size, true);
  }, [loading.more, pagination, fetchRecords]);

  // 刷新所有数据
  const refetchAll = useCallback(async () => {
    await Promise.all([fetchUserInfo(), fetchRecords(1, size, false)]);
  }, [fetchUserInfo, fetchRecords, size]);

  // 只刷新记录
  const refetchRecords = useCallback(async () => {
    await fetchRecords(1, size, false);
  }, [fetchRecords, size]);

  // 改变分页大小
  const changePageSize = useCallback(
    async (newSize) => {
      await fetchRecords(1, newSize, false);
    },
    [fetchRecords]
  );

  // 改变页码
  const changePage = useCallback(
    async (newPage) => {
      await fetchRecords(newPage, pagination.size, false);
    },
    [fetchRecords, pagination.size]
  );

  // 初始化加载 - 用户信息和记录
  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchUserInfo(), fetchRecords(1, size, false)]);
    };
    initData();
  }, []); // 只在组件挂载时执行一次

  return {
    // 数据
    userInfo,
    records,

    // 加载状态
    loading: loading.user || loading.records, // 总体加载状态
    loadingUser: loading.user,
    loadingRecords: loading.records,
    loadingMore: loading.more,

    // 错误状态
    error,

    // 分页信息
    pagination,

    // 操作方法
    refetchAll,
    refetchUserInfo: fetchUserInfo,
    refetchRecords,
    loadMore,
    changePage,
    changePageSize,
  };
};