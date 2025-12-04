import { useState, useCallback, useRef } from "react";
import { useSnackbar } from "../utils/SnackbarContext";
import { useTranslation } from "react-i18next";
import { apiService } from "../utils/apiService";

export const useAirdropAdvanced = () => {
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [airdropList, setAirdropList] = useState([]);
  const [airdropRecords, setAirdropRecords] = useState({
    list: [],
    pagination: {
      current: 1,
      size: 10,
      total: 0,
      hasMore: false,
    },
  });

  const [loadingMore, setLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);

  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // 获取空投列表
  const getAirdropList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.airdrop.airdropList({
        page: 1,
        size: 5,
      });
      const data = response.data || [];

      setAirdropList(data);
      return {
        list: data,
        total: data.length,
      };
    } catch (error) {
      console.error("获取空投列表失败:", error);
      showSnackbar(
        error.message || t("airdrop.getListFailed") || "获取空投列表失败",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, t]);

  // 领取单个空投
  const claimAirdrop = useCallback(
    async (claimData) => {
      setClaimLoading(true);
      try {
        const response = await apiService.airdrop.setAddress(claimData);
        
        // 领取成功后刷新列表
        await getAirdropList();
        
        return response;
      } catch (error) {
        console.error("领取空投失败:", error);
        
        let errorMessage = t("airdrop.claimFailed") || "领取失败";
        if (error.message?.includes("already claimed")) {
          errorMessage = t("airdrop.alreadyClaimed") || "已领取过该空投";
        } else if (error.message?.includes("insufficient")) {
          errorMessage = t("airdrop.insufficientBalance") || "余额不足";
        } else if (error.message) {
          errorMessage = error.message;
        }

        showSnackbar(errorMessage, "error");
        throw error;
      } finally {
        setClaimLoading(false);
      }
    },
    [showSnackbar, t, getAirdropList]
  );

  // 获取空投记录（带分页）
  const getAirdropRecords = useCallback(
    async (pagination = {}) => {
      if (isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      setLoading(true);
      
      try {
        const { current = 1, size = 10 } = pagination;

        const response = await apiService.airdrop.getList({
          page: current,
          size,
        });

        const data = response.data || {};

        setAirdropRecords({
          list: data || [],
          pagination: {
            current,
            size,
            total: data.length || 0,
            hasMore: size === data.length
          },
        });

        return data;
      } catch (error) {
        console.error("获取空投记录失败:", error);
        showSnackbar(
          error.message || t("airdrop.getRecordsFailed") || "获取记录失败",
          "error"
        );
        throw error;
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [showSnackbar, t]
  );

  // 加载更多空投记录
  const loadMoreRecords = useCallback(async () => {
    // 防止重复请求
    if (isFetchingRef.current || !airdropRecords.pagination.hasMore) {
      return;
    }

    const nextPage = airdropRecords.pagination.current + 1;
    
    // 如果已经加载了所有数据，就不再请求
    if (airdropRecords.list.length >= airdropRecords.pagination.total && airdropRecords.pagination.total > 0) {
      console.log("所有数据已加载完成");
      return;
    }

    isFetchingRef.current = true;
    setLoadingMore(true);

    try {
      const response = await apiService.airdrop.getList({
        page: nextPage,
        size: airdropRecords.pagination.size,
      });

      const data = response.data || [];
      const newRecords = data || [];
      
      // 合并数据
      const mergedList = [...airdropRecords.list, ...newRecords];
      
      setAirdropRecords({
        list: mergedList,
        pagination: {
          ...airdropRecords.pagination,
          current: nextPage,
          total: mergedList.length, // 更新总数
          hasMore:airdropRecords.pagination.size === newRecords.length
        },
      });

      return newRecords;
    } catch (error) {
      console.error("加载更多空投记录失败:", error);
      showSnackbar(
        error.message || t("airdrop.loadMoreFailed") || "加载更多失败",
        "error"
      );
      throw error;
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [airdropRecords, showSnackbar, t]);

  return {
    // 状态 - 保持原有接口
    loading,
    claimLoading,
    airdropList,
    airdropRecords: airdropRecords.list,
    pagination: airdropRecords.pagination,

    // 新增的加载更多状态
    loadingMore,
    
    // 方法 - 保持原有接口
    getAirdropList,
    claimAirdrop,
    getAirdropRecords,
    
    // 新增的加载更多方法
    loadMoreRecords,
    
    // 便捷状态 - 保持原有接口
    hasAirdrops: airdropList.length > 0,
    hasRecords: airdropRecords.list.length > 0,
    totalAirdrops: airdropList.length,
    totalRecords: airdropRecords.pagination.total,
    
    // 新增的便捷状态
    canLoadMore: airdropRecords.list.length < airdropRecords.pagination.total || 
                airdropRecords.pagination.total === 0,
  };
};