import React from "react";
import RewardHeader from "../../components/RewardHeader";
import { Box, Typography, Button, IconButton, Paper } from "@mui/material";
import ArrowBackIosNewIcon from "@material-ui/icons/ArrowBackIos"; // 你v5下仍可用
import ContentCopyIcon from "@material-ui/icons/FileCopyOutlined"; // 复制图标
import { useNavigate } from "react-router-dom";
import communityBig from "../../static/image/pages/communityBig.png";
import communitySmall from "../../static/image/pages/communitySmall.png";
const MyCommunityPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("51268925");
    alert("邀请码已复制");
  };

  const teamData = [
    {
      id: 1,
      address: "5x2h5f...5142",
      contribution: "18514 枚",
      personalValue: "16165.415",
      communityValue: "65415574.44",
    },
    {
      id: 2,
      address: "5x2h5f...5142",
      contribution: "18514 枚",
      personalValue: "16165.415",
      communityValue: "65415574.44",
    },
    {
      id: 3,
      address: "5x2h5f...5142",
      contribution: "18514 枚",
      personalValue: "16165.415",
      communityValue: "65415574.44",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: "12px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* 顶部导航 */}
      <RewardHeader title="我的社区" />
      {/* DAO 图片 */}
      <Box
        component="img"
        src={require("../../static/image/pages/community.png")}
        alt="DAO"
        sx={{ width: 150, height: 150 }}
      />

      {/* 邀请码 */}
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#333",
          mb: "12px",
        }}
      >
        51268925
      </Typography>

      {/* 复制按钮 */}
      <Button
        variant="contained"
        onClick={handleCopy}
        sx={{
          backgroundColor: "#CFF174",
          color: "#333",
          borderRadius: "25px",
          px: "40px",
          py: "10px",
          fontSize: 14,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#CFF174",
          },
        }}
      >
        复制邀请码
      </Button>

      {/* 提示文字 */}
      <Typography
        sx={{
          mt: "14px",
          fontSize: 13,
          color: "#999",
        }}
      >
        必须贡献至少10川普币才生成邀请码
      </Typography>

      {/* 分割线 */}
      <Box
        sx={{
          width: "80%",
          height: 1,
          bgcolor: "#DDD",
          my: 2,
        }}
      ></Box>

      {/* 按钮文字提示 */}
      <Typography sx={{ color: "#666", mb: 2 }}>按贡献值进行排序</Typography>

      {/* 我的大区卡片 */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: "15px",
          background: "linear-gradient(270deg, #E3DFFF 0%, #CFDEFE 100%)",
          border: "1px solid #E2D9FF",
          px: "16px",
          paddingTop: "24px",
          paddingBottom: "16px",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* 标题标签 */}
        <Box
          sx={{
            position: "absolute",
            top: -13,
            left: 0,
            backgroundImage: `url(${communityBig})`,
            backgroundSize: "88px 37px",
            backgroundRepeat: "no-repeat",
            color: "#fff",
            fontSize: 18,
            px: "10px",
            paddingBottom: "14px",
          }}
        >
          我的大区
        </Box>

        {/* 内容 */}
        {teamData.map((member, index) => (
          <Box
            sx={{
              mt: 1.5,
              bgcolor: "#fff",
              borderRadius: "12px",
              px: "12px",
              py: "16px",
            }}
          >
            {/* 地址行 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                地址
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {member.address}
              </Typography>
            </Box>

            {/* 贡献川普币 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                贡献川普币：
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {member.contribution}
              </Typography>
            </Box>

            {/* 个人贡献值 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                个人贡献值：
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {member.personalValue}
              </Typography>
            </Box>

            {/* 社区贡献值 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                社区贡献值：
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {member.communityValue}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default MyCommunityPage;
