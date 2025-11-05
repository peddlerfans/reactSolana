// hooks/useTeamReward.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const useTeamReward = (defaultType = "teamUser", defaultPage = 1, defaultSize = 10, userLevel = null) => {
  const [rewardData, setRewardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState(defaultType); // 'teamUser' | 'teamLevel'
  const [pagination, setPagination] = useState({
    page: defaultPage,
    size: defaultSize,
    total: 0,
    totalPages: 0,
    hasMore: false
  });

  // 获取奖励数据
  const fetchRewardData = useCallback(async (rewardType = type, page = pagination.page, size = pagination.size) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const requestData = { page, size };

      switch (rewardType) {
        case "teamUser":
          response = await apiService.reward.teamUser(requestData);
          break;
        case "teamLevel":
          // 需要用户等级参数
          if (!userLevel) {
            throw new Error("需要用户等级信息");
          }
          response = await apiService.reward.teamLevel({
            ...requestData,
            level: userLevel
          });
          break;
        default:
          throw new Error("未知的奖励类型");
      }

      const responseData = response.data;
      const listData = responseData?.list || responseData?.data || [];
      const total = responseData?.total || listData.length || 0;
      const totalPages = Math.ceil(total / size);

      setRewardData(responseData);
      setPagination({
        page,
        size,
        total,
        totalPages,
        hasMore: page < totalPages
      });

      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || `获取${getRewardTypeText(rewardType)}失败`;
      setError(errorMessage);
      console.error(`获取${getRewardTypeText(rewardType)}失败:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [type, pagination.page, pagination.size, userLevel]);

  // 切换奖励类型
  const changeRewardType = useCallback(async (newType) => {
    setType(newType);
    // 切换类型时重置到第一页
    await fetchRewardData(newType, 1, pagination.size);
  }, [fetchRewardData, pagination.size]);

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;
    
    const nextPage = pagination.page + 1;
    try {
      setLoading(true);
      
      const newData = await fetchRewardData(type, nextPage, pagination.size);
      
      // 合并数据
      setRewardData(prev => ({
        ...prev,
        ...newData,
        list: [...(prev?.list || []), ...(newData?.list || [])]
      }));
      
    } catch (err) {
      console.error("加载更多失败:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, type, fetchRewardData]);

  // 改变分页
  const changePage = useCallback(async (newPage, newSize = pagination.size) => {
    await fetchRewardData(type, newPage, newSize);
  }, [type, fetchRewardData, pagination.size]);

  // 刷新数据
  const refetch = useCallback(async () => {
    await fetchRewardData(type, 1, pagination.size);
  }, [type, fetchRewardData, pagination.size]);

  // 初始化加载
  useEffect(() => {
    // 如果teamLevel需要等级但等级还没获取到，先不请求
    if (type === "teamLevel" && !userLevel) {
      setLoading(false);
      setError("等待用户等级信息...");
      return;
    }
    
    fetchRewardData();
  }, []);

  // 当userLevel变化时重新获取teamLevel数据
  useEffect(() => {
    if (type === "teamLevel" && userLevel) {
      fetchRewardData("teamLevel", 1, pagination.size);
    }
  }, [userLevel]);

  // 获取奖励类型的中文名称
  const getRewardTypeText = (rewardType) => {
    switch (rewardType) {
      case "teamUser": return "团队奖励";
      case "teamLevel": return "等级奖励";
      default: return "奖励";
    }
  };

  return {
    // 数据
    rewardData,
    rewardList: rewardData?.list || rewardData?.data || [],
    
    // 加载状态
    loading,
    error,
    
    // 分页信息
    pagination,
    
    // 类型信息
    type,
    
    // 操作方法
    changeRewardType,
    loadMore,
    changePage,
    refetch,
    fetchRewardData,
    
    // 工具函数
    getRewardTypeText: () => getRewardTypeText(type)
  };
};