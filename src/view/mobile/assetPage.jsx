import React, { useState } from "react";
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
import GlobalSnackbar from "../../components/GlobalSnackbar";
const RewardPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const pageSize = 10;
  // 根据tab决定使用哪个type
  const getTypeByTab = (tabIndex) => {
    switch (tabIndex) {
      case 0: return "in";
      case 1: return "out";
      default: return null;
    }
  };

  const type = getTypeByTab(tab);
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
  } = useUserInfo(type, currentPage, pageSize);

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
          加载失败: {error}
        </Typography>
        <Button
          onClick={refetchRecords}
          variant="contained"
          sx={{
            bgcolor: "#A069F6",
            color: "white",
          }}
        >
          重新加载
        </Button>
      </Box>
    );
  }

  // 处理加载状态
  if (loading && tab === 0 && !userInfo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  const contributionData = [
    {
      id: 1,
      type: "质押",
      amount: "120",
      coins: "666",
      date: "2025/11/11",
    },
    {
      id: 2,
      type: "质押",
      amount: "120",
      coins: "666",
      date: "2025/11/11",
    },
    {
      id: 3,
      type: "质押",
      amount: "120",
      coins: "666",
      date: "2025/11/11",
    },
    {
      id: 4,
      type: "质押",
      amount: "120",
      coins: "666",
      date: "2025/11/11",
    },
  ];

  const withdrawalData = [
    {
      id: 1,
      type: "提现",
      amount: "-100",
      fee: "1%",
      received: "120",
      date: "2025/11/11",
    },
    {
      id: 2,
      type: "提现",
      amount: "-100",
      fee: "1%",
      received: "120",
      date: "2025/11/11",
    },
    {
      id: 3,
      type: "提现",
      amount: "-100",
      fee: "1%",
      received: "120",
      date: "2025/11/11",
    },
    {
      id: 4,
      type: "提现",
      amount: "-100",
      fee: "1%",
      received: "120",
      date: "2025/11/11",
    },
  ];

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
            贡献总数
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
            个人贡献值
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
            {userInfo.balance}川普币
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
            {userInfo.left_reward + '川普币'}
            <Typography
              component="span"
              sx={{
                fontSize: "14px",
                color: userInfo?.burn_flag ? "#ff4d4f" : "#95BE25",
                fontWeight: "bold",
                ml: 0.5
              }}
            >
              {userInfo?.burn_flag ? '/已烧伤' : '/未烧伤'}
            </Typography>
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
                <ListItem sx={{
                  py: 1
                }}>
                  <Box sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between"
                  }}>
                    <Typography variant="body2" sx={{
                      fontWeight: "bold",
                      color: "#333",
                      width: "25%",
                      textAlign: "center"
                    }}>
                      交易流水号
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontWeight: "bold",
                      color: "#333",
                      width: "25%",
                      textAlign: "center"
                    }}>
                      数量
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontWeight: "bold",
                      color: "#333",
                      width: "25%",
                      textAlign: "center"
                    }}>
                      系数
                    </Typography>
                    <Typography variant="body2" sx={{
                      fontWeight: "bold",
                      color: "#333",
                      width: "25%",
                      textAlign: "center"
                    }}>
                      日期
                    </Typography>
                  </Box>
                </ListItem>

                {/* 数据列表 */}
                {records.map((item, index) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      borderBottom: index === records.length - 1
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
                      {/* 交易流水号 */}
                      <Typography
                        variant="body2"
                        sx={{
                          width: "25%",
                          textAlign: "center",
                          color: "#666",
                          display: "inline-block",
                          whiteSpace: "pre-line",
                          wordBreak: "break-word"
                        }}
                      >
                        {item.transaction_no || "川普币"} {/* 根据你的数据结构调整 */}
                      </Typography>

                      {/* 数量 */}
                      <Typography
                        variant="body2"
                        sx={{
                          width: "25%",
                          textAlign: "center",
                          color: "#444",
                          fontWeight: "bold"
                        }}
                      >
                        {item.amount}
                      </Typography>

                      {/* 系数 */}
                      <Typography
                        variant="body2"
                        sx={{
                          width: "25%",
                          textAlign: "center",
                          color: "#666"
                        }}
                      >
                        {item.coefficient || "1.0"} {/* 根据你的数据结构调整 */}
                      </Typography>

                      {/* 日期 */}
                      <Typography
                        variant="body2"
                        sx={{
                          width: "25%",
                          textAlign: "center",
                          color: "#666"
                        }}
                      >
                        {item.create_time || "2024-01-01"} {/* 根据你的数据结构调整 */}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* 贡献记录 Tab */}
          {tab === 1 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {contributionData.map((item, index) => (
                <Paper
                  key={item.id}
                  sx={{
                    boxShadow: "none",
                    borderRadius: 2,
                    mb:
                      index === records.length - 1
                        ? 0
                        : "22px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={require("../../static/image/pages/pledgeImg.png")}
                        alt=""
                        width={26}
                        height={26}
                        style={{
                          marginRight: "10px",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            mb: 0.5,
                            fontSize: "14px",
                            color: "#333",
                          }}
                        >
                          {t("assets.text12")}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#444", fontSize: "14px" }}
                        >
                          {item.coins + t("trump")}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#95BE25",
                          textAlign: "end",
                          fontSize: "14px",
                        }}
                      >
                        {t("assets.text13", { value: item.amount })}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#999",
                          textAlign: "end",
                          fontSize: "14px",
                        }}
                      >
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
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
