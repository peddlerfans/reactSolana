// hooks/useRankList.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const useRankList = (defaultType = "big", defaultPage = 1, defaultSize = 10) => {
  const [rankData, setRankData] = useState(null); // 改为存储整个data对象
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState(defaultType);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    size: defaultSize,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

  // 获取排行榜数据
  const fetchRankList = useCallback(async (rankType = type, page = pagination.page, size = pagination.size) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const requestData = { page, size };

      switch (rankType) {
        case "big":
          response = await apiService.rank.bigRankList(requestData);
          break;
        case "yongdong":
          response = await apiService.rank.yongdongRankList(requestData);
          break;
        case "new":
          response = await apiService.rank.newRankList(requestData);
          break;
        default:
          // throw new Error("未知的排行榜类型");
      }

      // 保存整个data对象，而不仅仅是list
      const responseData = response.data;
      const listData = responseData?.list || [];
      const total = responseData?.total || listData.length || 0;
      const totalPages = Math.ceil(total / size);

      setRankData(responseData); // 保存整个data对象
      setPagination({
        page,
        size,
        total,
        totalPages,
        hasMore: size === total
      });

      return responseData; // 返回整个data对象
    } catch (err) {
      const errorMessage = err.response?.data?.message || `获取${getRankTypeText(rankType)}失败`;
      setError(errorMessage);
      console.error(`获取${getRankTypeText(rankType)}失败:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [type, pagination.page, pagination.size]);

  // 切换排行榜类型
  const changeRankType = useCallback(async (newType) => {
    setType(newType);
    await fetchRankList(newType, 1, pagination.size);
  }, [fetchRankList, pagination.size]);

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;
    
    const nextPage = pagination.page + 1;
    try {
      setLoading(true);
      
      const newData = await fetchRankList(type, nextPage, pagination.size);
      
      // 如果是大单榜或新增榜（支持分页），合并数据
      if (type === "big" || type === "new") {
        setRankData(prev => ({
          ...prev,
          ...newData,
          list: [...(prev?.list || []), ...(newData?.list || [])]
        }));
      }
      
    } catch (err) {
      console.error("加载更多失败:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, type, fetchRankList]);

  // 改变分页
  const changePage = useCallback(async (newPage, newSize = pagination.size) => {
    await fetchRankList(type, newPage, newSize);
  }, [type, fetchRankList, pagination.size]);

  // 刷新数据
  const refetch = useCallback(async () => {
    await fetchRankList(type, 1, pagination.size);
  }, [type, fetchRankList, pagination.size]);

  // 初始化加载
  useEffect(() => {
    fetchRankList();
  }, []);

  // 获取排行榜类型的中文名称
  const getRankTypeText = (rankType) => {
    switch (rankType) {
      case "big": return "大单榜";
      case "yongdong": return "永动榜";
      case "new": return "新增榜";
      default: return "排行榜";
    }
  };

  return {
    // 数据 - 返回整个data对象
    rankData, // 包含 pool_total, list 等完整数据
    rankList: rankData?.list || [], // 为了方便使用，也提供list的快捷访问
    
    // 加载状态
    loading,
    error,
    
    // 分页信息
    pagination,
    
    // 操作方法
    changeRankType,
    loadMore,
    changePage,
    refetch,
    fetchRankList,
    
    // 工具函数
    getRankTypeText: () => getRankTypeText(type),
    type
  };
};