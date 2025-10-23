import React, { useState } from "react";
import RewardHeader from "../../components/RewardHeader";
import BottomDialog from "../../components/BottomDialog";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import assetHeader from "../../static/image/pages/assetHeader.png";
const RewardPage = () => {
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

  // 假数据
  const staticEarningsData = {
    total: "18514川普币",
    dividends: [
      { id: 1, amount: "0.12345678" },
      { id: 2, amount: "0.12345678" },
      { id: 3, amount: "0.12345678" },
      { id: 4, amount: "0.12345678" },
      { id: 5, amount: "0.12345678" },
      { id: 6, amount: "0.12345678" },
    ],
  };

  const contributionData = [
    {
      id: 1,
      type: "质押",
      amount: "+获得120贡献值",
      coins: "666川普币",
      date: "2025/11/11",
    },
    {
      id: 2,
      type: "质押",
      amount: "+获得120贡献值",
      coins: "666川普币",
      date: "2025/11/11",
    },
    {
      id: 3,
      type: "质押",
      amount: "+获得120贡献值",
      coins: "666川普币",
      date: "2025/11/11",
    },
    {
      id: 4,
      type: "质押",
      amount: "+获得120贡献值",
      coins: "666川普币",
      date: "2025/11/11",
    },
  ];

  const withdrawalData = [
    {
      id: 1,
      type: "提现",
      amount: "-100川普币",
      fee: "1%手续费",
      received: "+到账120川普币",
      date: "2025/11/11",
    },
    {
      id: 2,
      type: "提现",
      amount: "-100川普币",
      fee: "1%手续费",
      received: "+到账120川普币",
      date: "2025/11/11",
    },
    {
      id: 3,
      type: "提现",
      amount: "-100川普币",
      fee: "1%手续费",
      received: "+到账120川普币",
      date: "2025/11/11",
    },
    {
      id: 4,
      type: "提现",
      amount: "-100川普币",
      fee: "1%手续费",
      received: "+到账120川普币",
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
      <RewardHeader title="我的资产"/>
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
            总贡献值
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            16165.415
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
            可提现数额
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            18514川普币
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
            贡献总数
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            18514川普币
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
            {" "}
            剩余奖励额度
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
            632.21川普币/已烧伤
          </Typography>
        </Box>

        <Button
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
          转出
        </Button>
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
            label="静态收益"
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
            label="贡献记录"
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
            label="转出记录"
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  // eslint-disable-next-line no-dupe-keys
                  sx={{ fontSize: "14px", color: "#333", fontSize: "15px" }}
                >
                  静态收益：
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "16px",
                    color: "#95BE25",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  {staticEarningsData.total}
                </Typography>
              </Box>

              {/* <Divider sx={{ mb: 2 }} /> */}

              {staticEarningsData.dividends.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb:
                      index === staticEarningsData.dividends.length - 1
                        ? 0
                        : "20px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "14px", color: "#888" }}
                  >
                    静态分红：
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "14px", color: "#444", fontWeight: "bold" }}
                  >
                    {item.amount}
                  </Typography>
                </Box>
              ))}
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
                      index === staticEarningsData.dividends.length - 1
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
                          {item.type}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#444", fontSize: "14px" }}
                        >
                          {item.coins}
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
                        {item.amount}
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

          {/* 转出记录 Tab */}
          {tab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {withdrawalData.map((item, index) => (
                <Paper
                  key={item.id}
                  sx={{
                    borderRadius: 2,
                    boxShadow:"none",
                    mb:
                      index === staticEarningsData.dividends.length - 1
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
                        src={require("../../static/image/pages/transferOut.png")}
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
                            color: "#333",
                            mb: "6px",
                            fontSize: "14px",
                          }}
                        >
                          {item.amount}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#999", fontSize: "14px" }}
                        >
                          {item.fee}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#95BE25",
                          fontWeight: "500",
                          textAlign: "end",
                        }}
                      >
                        {item.received}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#999",
                          fontWeight: "400",
                          textAlign: "end",
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
    </Box>
  );
};

export default RewardPage;
