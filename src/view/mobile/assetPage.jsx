import React, { useState } from "react";
import RewardHeader from "../../components/RewardHeader";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";

const RewardPage = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: "#f6f6f6", minHeight: "100vh", width: "100%" }}>
      <RewardHeader />

      {/* 顶部背景和信息卡 */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #E9E5FF 0%, #F7F7F7 100%)",
          borderRadius: 2,
          m: 2,
          p: 2,
          textAlign: "center",
        }}
      >
        <img
          src={require("../../static/image/pages/assetBgi.png")}
          alt="dao"
          width={100}
          style={{ marginBottom: 8 }}
        />
        <Typography variant="body1">贡献总数：18514川普币</Typography>
        <Typography variant="body1">总贡献值：16165.415</Typography>
        <Typography variant="body1">可提现数额：18514川普币</Typography>
        <Typography variant="body1" color="error">
          剩余奖励额度：632.21川普币 / 已烧伤
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#C8F56E",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "20px",
          }}
        >
          转出
        </Button>
      </Box>

      {/* Tabs 区域 */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="静态收益" />
        <Tab label="贡献记录" />
        <Tab label="转出记录" />
      </Tabs>

      {/* 内容区 */}
      <Box sx={{ p: 2 }}>
        {tab === 0 && <Typography>这里是静态收益内容</Typography>}
        {tab === 1 && <Typography>这里是贡献记录内容</Typography>}
        {tab === 2 && <Typography>这里是转出记录内容</Typography>}
      </Box>
    </Box>
  );
};

export default RewardPage;
