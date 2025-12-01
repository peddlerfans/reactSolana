import { useState, useCallback } from "react";
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
    },
  });

  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // 获取空投列表（带过滤）
  const getAirdropList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.airdrop.airdropList({
        page: "1",
        size: "5",
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

  // 领取空投（支持多个空投）
  const claimAirdrop = useCallback(
    async (claimData) => {
      setClaimLoading(true);
      try {
        const response = await apiService.airdrop.setAddress(claimData);

        showSnackbar(t("airdrop.claimSuccess") || "领取成功", "success");

        // 领取成功后刷新列表
        await getAirdropList();

        return response.data;
      } catch (error) {
        console.error("领取空投失败:", error);

        // 更详细的错误处理
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
      }
    },
    [showSnackbar, t]
  );

  // 批量操作
  const batchClaim = useCallback(
    async (airdropIds) => {
      if (!airdropIds || airdropIds.length === 0) {
        showSnackbar("请选择要领取的空投", "warning");
        return;
      }

      setClaimLoading(true);
      try {
        const claims = airdropIds.map((id) => claimAirdrop({ airdropId: id }));

        const results = await Promise.allSettled(claims);

        const successful = results.filter(
          (result) => result.status === "fulfilled"
        ).length;
        const failed = results.filter(
          (result) => result.status === "rejected"
        ).length;

        if (successful > 0) {
          showSnackbar(`成功领取 ${successful} 个空投`, "success");
        }
        if (failed > 0) {
          showSnackbar(`${failed} 个空投领取失败`, "warning");
        }

        // 刷新数据
        await getAirdropList();

        return results;
      } catch (error) {
        console.error("批量领取失败:", error);
        throw error;
      } finally {
        setClaimLoading(false);
      }
    },
    [claimAirdrop, getAirdropList, showSnackbar]
  );

  // 搜索空投记录
  const searchRecords = useCallback(
    async (keyword, pagination = {}) => {
      return await getAirdropRecords({
        ...pagination,
        keyword,
      });
    },
    [getAirdropRecords]
  );

  return {
    // 状态
    loading,
    claimLoading,
    airdropList,
    airdropRecords: airdropRecords.list,
    pagination: airdropRecords.pagination,

    // 方法
    getAirdropList,
    claimAirdrop,
    getAirdropRecords,
    batchClaim,
    searchRecords,

    // 便捷状态
    hasAirdrops: airdropList.length > 0,
    hasRecords: airdropRecords.list.length > 0,
    totalAirdrops: airdropList.length,
    totalRecords: airdropRecords.pagination.total,

    // 过滤方法
    getAvailableAirdrops: () =>
      airdropList.filter((item) => item.status === "available"),
    getClaimedAirdrops: () =>
      airdropList.filter((item) => item.status === "claimed"),
    getExpiredAirdrops: () =>
      airdropList.filter((item) => item.status === "expired"),
  };
};
