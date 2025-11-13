// hooks/useNftList.js
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../utils/apiService";

export const useNftList = (
  defaultPage = 1,
  defaultSize = 10,
  transactionType = null,
  incomeType = null
) => {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: defaultPage,
    size: defaultSize,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // 获取NFT列表
  const fetchNftList = useCallback(
    async (
      page = pagination.page,
      size = pagination.size,
      transType = transactionType,
      incType = incomeType
    ) => {
      try {
        setLoading(true);
        setError(null);

        // 构建请求参数
        const requestData = { page, size };

        // 添加交易类型参数（如果提供）
        if (transType !== null && transType !== undefined) {
          requestData.transaction_type = transType;
        }

        // 添加金额变动类型参数（如果提供）
        if (incType !== null && incType !== undefined) {
          requestData.income_type = incType;
        }

        console.log("NFT列表请求参数:", requestData); // 调试用

        const response = await apiService.nft.getList(requestData);
        console.log(response);

        const responseData = response.data;
        const listData = responseData?.list || responseData?.data || [];
        const total = responseData?.total || listData.length || 0;
        const totalPages = Math.ceil(total / size);

        setNftData(responseData);
        setPagination({
          page,
          size,
          total,
          totalPages,
          hasMore: size === total,
        });

        return responseData;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "获取NFT列表失败";
        setError(errorMessage);
        console.error("获取NFT列表失败:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.size, transactionType, incomeType]
  );

  // 加载更多
  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore) return;

    const nextPage = pagination.page + 1;
    try {
      setLoading(true);

      const newData = await fetchNftList(
        nextPage,
        pagination.size,
        transactionType,
        incomeType
      );

      // 合并数据
      setNftData((prev) => ({
        ...prev,
        ...newData,
        list: [...(prev?.list || []), ...(newData?.list || [])],
      }));
    } catch (err) {
      console.error("加载更多失败:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, fetchNftList, transactionType, incomeType]);

  // 改变分页
  const changePage = useCallback(
    async (newPage, newSize = pagination.size) => {
      await fetchNftList(newPage, newSize, transactionType, incomeType);
    },
    [fetchNftList, pagination.size, transactionType, incomeType]
  );

  // 刷新数据
  const refetch = useCallback(async () => {
    await fetchNftList(1, pagination.size, transactionType, incomeType);
  }, [fetchNftList, pagination.size, transactionType, incomeType]);

  // 改变交易类型
  const changeTransactionType = useCallback(
    async (newTransactionType) => {
      await fetchNftList(1, pagination.size, newTransactionType, incomeType);
    },
    [fetchNftList, pagination.size, incomeType]
  );

  // 改变金额变动类型
  const changeIncomeType = useCallback(
    async (newIncomeType) => {
      await fetchNftList(1, pagination.size, transactionType, newIncomeType);
    },
    [fetchNftList, pagination.size, transactionType]
  );

  // 同时改变两个类型
  const changeTypes = useCallback(
    async (newTransactionType, newIncomeType) => {
      await fetchNftList(1, pagination.size, newTransactionType, newIncomeType);
    },
    [fetchNftList, pagination.size]
  );

  // 初始化加载
  useEffect(() => {
    fetchNftList();
  }, []);

  // 当交易类型或金额变动类型变化时重新获取数据
  useEffect(() => {
    fetchNftList(1, pagination.size, transactionType, incomeType);
  }, [transactionType, incomeType]);

  return {
    // 数据
    nftData,
    nftList: nftData?.list || nftData?.data || [],

    // 加载状态
    loading,
    error,

    // 分页信息
    pagination,

    // 类型信息
    transactionType,
    incomeType,

    // 操作方法
    loadMore,
    changePage,
    refetch,
    fetchNftList,
    changeTransactionType,
    changeIncomeType,
    changeTypes,
  };
};
