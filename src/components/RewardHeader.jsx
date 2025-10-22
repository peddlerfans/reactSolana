import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@material-ui/icons/ArrowBack"; // ✅ v4 的导入方式
import { useNavigate } from "react-router-dom"; // 用于页面跳转

const RewardHeader = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ px: 2, py: 1 }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {/* 返回按钮 */}
        <IconButton edge="start" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        {/* 标题 */}
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
        >
          社区奖励
        </Typography>

        {/* 占位符（右侧空白保持标题居中） */}
        <Box sx={{ width: 40 }} />
      </Toolbar>
    </AppBar>
  );
};

export default RewardHeader;
