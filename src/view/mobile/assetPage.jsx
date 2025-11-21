import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import RewardHeader from "../../components/RewardHeader";
import BottomDialog from "../../components/BottomDialog";
import {
  Box,
  Typography,
  List,
  Tabs,
  Tab,
  Paper,
  ListItem,
  Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import assetHeader from "../../static/image/pages/assetHeader.png";
import { useUserInfo } from '../../hooks/useUserInfo';
import { useWithdrawList } from "../../hooks/useWithdrawList";
import GlobalSnackbar from "../../components/GlobalSnackbar";
import LoadMore from "../../components/LoadMore";
import { DataLoader } from "../../components/DataLoader";
const RewardPage = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(0);
  const [withdrawType, setWithdrawType] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  useEffect(() => {
    // update on route change
    if (location.search) {
      setTab(1)
      setWithdrawType(searchParams.get("type"))
      changeWithdrawType(searchParams.get("type"))
    } else {
      setTab(0)
    }
  }, [location.search]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setCurrentPage(1); // 切换tab时重置页码
  };

  const {
    userInfo,
    records,
    loading,
    error,
    pagination,
    refetch,
    refetchRecords,
    loadMore,
    changePage
  } = useUserInfo(currentPage, 10);
  const {
    withdrawData,
    loading: withdrawLoading,
    error: withdrawError,
    pagination: withdrawPagination,
    changeWithdrawType,
    loadMore: withdrawLoadMore,
    refetch: withdrawRefetch,
  } = useWithdrawList(withdrawType, 1, 10);
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setToast({ open: true, message: '质押成功！', type: 'success' });
  };
  const handleConfirm = () => {
    console.log("输入的内容:", inputValue);
    // 这里处理确定按钮的逻辑
    handleCloseDialog();
  };

  const handleCancel = () => {
    // 这里处理取消按钮的逻辑
    handleCloseDialog();
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // 处理加载状态
  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "#F1EFF9",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <Box
        sx={{
          bgcolor: "#F1EFF9",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography color="error" sx={{ mb: 2 }}>
          {t("loadError")+error}
        </Typography>
        <Button
          onClick={refetchRecords}
          variant="contained"
          sx={{
            bgcolor: "#A069F6",
            color: "white",
          }}
        >
          {t("loadagain")}
        </Button>
      </Box>
    );
  }

  // 处理加载状态
  if (loading && tab === 0 && !userInfo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <Typography>{t("loading")}</Typography>
      </Box>
    );
  }
  const getWithdrawTypeText = (type) => {
    const typeMap = {
      1: t("assets.text22"),
      2: t("assets.text23"),
      3: t("assets.text24"),
      4: t("assets.text25"),
      5: t("assets.text26"),
      6: t("assets.text27"),
      7: t("assets.text28"),
    };
    return typeMap[type] || "提现记录";
  };
  return (
    <Box
      sx={{
        bgcolor: "#F1EFF9",
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${assetHeader})`,
        backgroundSize: "100% 320px",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "multiply",
        position: "relative",
      }}
    >
      <RewardHeader title={t("assets.text1")} />
      <img
        src={require("../../static/image/pages/assetBgi.png")}
        alt="dao"
        width={200}
        height={140}
        style={{
          marginBottom: 8,
          position: "absolute",
          left: "50%",
          top: "96px",
          transform: "translateX(-50%)",
        }}
      />
      {/* 顶部背景和信息卡 */}
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.60)",
          backdropFilter: "blur(7.5px)",
          border: "1px solid #FFF",
          borderRadius: "12px",
          mx: "12px",
          marginTop: "106px",
          marginBottom: "20px",
          px: "12px",
          py: "16px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
          }}
        >
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#888" }}>
            {t('assets.text4')}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            {userInfo.total_pledge_balance}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
          }}
        >
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#888" }}>
            {t("assets.text21")}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            {userInfo.person_contribution_value}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
          }}
        >
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#888" }}>
            {t("assets.text3")}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            {userInfo.balance + t("trump")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: "20px",
          }}
        >
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#888" }}>
            {t("assets.text5")}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            {userInfo.left_reward + t("trump")}
          </Typography>
        </Box>

        {/* <Button
          onClick={handleOpenDialog}
          variant="contained"
          sx={{
            width: "100%",
            mt: "20px",
            bgcolor: "#CFF174",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "30px",
            boxShadow: "none",
          }}
        >
          {t("assets.text7")}
        </Button> */}
      </Box>

      <Box
        sx={{
          p: "12px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          bgcolor: "#fff",
          minHeight: "400px",
        }}
      >
        {/* Tabs 区域 */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            backgroundColor: "#F7F7FA",
            borderRadius: "20px",
            py: "6px",
            minHeight: "44px",
            "& .MuiTabs-indicator": {
              display: "none", // 隐藏默认的底部指示器
            },
          }}
        >
          <Tab
            label={t("assets.text8")}
            sx={{
              borderRadius: "20px",
              minHeight: "32px",
              "&.Mui-selected": {
                backgroundColor: "#A069F6",
                color: "white",
              },
              "&:not(.Mui-selected)": {
                color: "#000",
              },
            }}
          />
          <Tab
            label={t("assets.text10")}
            sx={{
              borderRadius: "20px",
              minHeight: "32px",
              "&.Mui-selected": {
                backgroundColor: "#A069F6",
                color: "white",
              },
              "&:not(.Mui-selected)": {
                color: "#000",
              },
            }}
          />
        </Tabs>

        {/* 内容区 */}
        {/* Tab 内容 */}
        <Box sx={{ mt: "20px" }}>
          {/* 静态收益 Tab */}
          {tab === 0 && (
            <Paper sx={{ borderRadius: 2, boxShadow: "none" }}>
              {/* 表头 */}
              <List sx={{ py: 0 }}>

                {/* 数据列表 */}
                <DataLoader
                  loading={loading}
                  error={error}
                  onRetry={refetch}
                  data={records}
                >
                  {records => (records?.map((item, index) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderBottom: index === records?.length - 1
                          ? "none"
                          : "1px solid #f0f0f0",
                        py: 2,
                      }}
                    >
                      <Box sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          {/* 交易流水号 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#333",
                              fontSize: "15px",
                              mb: "4px"
                            }}
                          >
                            {"TRUMP"} {/* 根据你的数据结构调整 */}
                          </Typography>
                          {/* 日期 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#999",
                              fontSize: "13px"
                            }}
                          >
                            {item.create_time || "2024-01-01"} {/* 根据你的数据结构调整 */}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          {/* 数量 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#95BE25",
                              fontWeight: "bold",
                              fontSize: "14px",
                              mb: "4px"
                            }}
                          >
                            {'+' + item.amount}
                          </Typography>

                          {/* 系数 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#666",
                              fontSize: "13px"
                            }}
                          >
                            {item.coefficient || "1.0"} {/* 根据你的数据结构调整 */}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  )))}
                </DataLoader>
                <LoadMore
                  loading={loading}
                  hasMore={pagination.hasMore}
                  onLoadMore={loadMore}
                />
              </List>
            </Paper>
          )}

          {/* 贡献记录 Tab */}
          {tab === 1 && (
            <Paper sx={{ borderRadius: 2, boxShadow: "none" }}>
              {/* 表头 */}
              <List sx={{ py: 0 }}>
                {/* 数据列表 */}
                <DataLoader
                  loading={withdrawLoading}
                  error={withdrawError}
                  onRetry={withdrawRefetch}
                  data={withdrawData}
                >
                  {withdrawData => (withdrawData?.map((item, index) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderBottom: index === withdrawData?.length - 1
                          ? "none"
                          : "1px solid #f0f0f0",
                        py: 2,
                      }}
                    >
                      <Box sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                          {/* 转出池 */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#333",
                              mb: "14px",
                              fontSize: "15px"
                            }}
                          >
                            {getWithdrawTypeText(item.token)} {/* 根据你的数据结构调整 */}
                          </Typography>
                          {/* 手续费 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#999",
                              fontSize: "14px"
                            }}
                          >
                            {t("assets.text29") + item.fee} {/* 根据你的数据结构调整 */}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#999",
                              fontSize: "14px"
                            }}
                          >
                            {t("assets.text30")}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "flex-end", flexDirection: "column" }}>
                          {/* 日期 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#999",
                              fontSize: "13px",
                              mb: "13px"
                            }}
                          >
                            {item.create_time} {/* 根据你的数据结构调整 */}
                          </Typography>
                          {/* 数量 */}
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#333",
                              fontSize: "14px"
                            }}
                          >
                            {item.total_amount - item.amount}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              textAlign: "center",
                              color: "#95BE25",
                              fontSize: "14px"
                            }}
                          >
                            {item.amount} {/* 根据你的数据结构调整 */}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  )))}
                </DataLoader>
                <LoadMore
                  loading={withdrawLoading}
                  hasMore={withdrawPagination.hasMore}
                  onLoadMore={withdrawLoadMore}
                />
              </List>
            </Paper>
          )}
        </Box>
      </Box>
      <BottomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title="转出数量选择"
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="确定"
        cancelText="取消"
        inputLabel="请输入转出数量"
        inputPlaceholder="请输入一些内容..."
      />
      <GlobalSnackbar
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.type}
      />
    </Box>
  );
};

export default RewardPage;
