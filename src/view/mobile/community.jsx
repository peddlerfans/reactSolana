import React, { useState, useEffect } from "react";
import RewardHeader from "../../components/RewardHeader";
import { Box, Typography, Button, IconButton, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetMyTeam } from "../../hooks/useMyTeam"
import { DataLoader } from "../../components/DataLoader";
import { formatAddress } from '../../utils/format';
import communityBig from "../../static/image/pages/communityBig.png";
import communitySmall from "../../static/image/pages/communitySmall.png";
import { useSnackbar } from "../../utils/SnackbarContext";
import { useWalletReady } from "../../utils/WalletReadyContext";
import { useUser } from "../../utils/UserContext";
const MyCommunityPage = () => {
  const { team, loading, error, refetch } = useGetMyTeam();
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbar();
  const { isLoggedIn, userInfo } = useUser(); // 获取登录状态和用户信息
  const { walletReady } = useWalletReady();

  const handleCopy = () => {
    navigator.clipboard.writeText(team.invite_code);
    showSnackbar(t('community.text12'), 'success');
  };
  // useEffect(() => {
  //   console.log("登录状态变化", {
  //     isLoggedIn,
  //     hasUserInfo: !!userInfo,
  //     walletReady
  //   });

  //   if (isLoggedIn && userInfo) {
  //     console.log("用户已登录，重新请求数据");
  //     refetch();
  //   }
  // }, [isLoggedIn, userInfo]);
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: "12px",
        width: "100%",
        boxSizing: "border-box",
        overflow:"scroll"
      }}
    >
      {/* 顶部导航 */}
      <RewardHeader title={t("community.text1")} />

      <DataLoader
        loading={loading}
        error={error}
        data={team}
        onRetry={false}
      >

        {team => (
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* DAO 图片 */}
            <Box
              component="img"
              src={require("../../static/image/pages/community.png")}
              alt="DAO"
              sx={{ width: 150, height: 150 }}
            />

            {/* 邀请码 */}
            {team.invite_code ? <Typography
              sx={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
                mb: "12px",
              }}
            >
              {team.invite_code}
            </Typography> : <Typography>{t("community.text14")}</Typography>}

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
              {t("community.text2")}
            </Button>

            {/* 提示文字 */}
            <Typography
              sx={{
                mt: "14px",
                fontSize: 13,
                color: "#999",
              }}
            >
              {t("community.text3")}
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
            <Typography sx={{
              color: "#666",
              mb: "34px",
              fontSize: "13px",
              position: "relative",
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                width: '74px', // 横线长度
                height: '1px',
                backgroundColor: '#D9D9D9',
              },
              '&::before': {
                left: '-80px', // 文字左边距 + 横线长度
              },
              '&::after': {
                right: '-80px', // 文字右边距 + 横线长度
              }
            }}>{t("community.text4")}</Typography>

            {/* 我的大区卡片 */}
            {team.big_region.address ? (<Paper
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
                {t("community.text5")}
              </Box>

              {/* 内容 */}
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
                    {t("community.text6")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {formatAddress(team.big_region.address)}
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
                    {t("community.text7")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {/* {member.contribution} */}
                    {team.big_region.pledge_balance + t("community.text8")}
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
                    {t("community.text9")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {team.big_region.person_contribution_value}
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
                    {t("community.text10")}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {team.big_region.team_contribution_value || 0}
                  </Typography>
                </Box>
              </Box>
            </Paper>) : (<Box></Box>)}


            {/* 我的小区卡片 */}
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: "15px",
                background: "linear-gradient(270deg, #DDF4F0 0%, #D1F3D5 100%)",
                px: "16px",
                paddingTop: "24px",
                paddingBottom: "16px",
                position: "relative",
                boxSizing: "border-box",
                marginTop: "34px",
              }}
            >
              {/* 标题标签 */}
              <Box
                sx={{
                  position: "absolute",
                  top: -13,
                  left: 0,
                  backgroundImage: `url(${communitySmall})`,
                  backgroundSize: "88px 37px",
                  backgroundRepeat: "no-repeat",
                  color: "#fff",
                  fontSize: 18,
                  px: "10px",
                  paddingBottom: "14px",
                }}
              >
                {t("community.text11")}
              </Box>

              {/* 内容 */}
              {team.small_region.length > 0 ? (team.small_region.map((member, index) => (
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
                      {t("community.text6")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {formatAddress(member.address)}
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
                      {t("community.text7")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {(member.pledge_balance || 0) + t("community.text8")}
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
                      {t("community.text9")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {member.person_contribution_value || 0}
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
                      {t("community.text10")}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {member.communityValue || 0 }
                    </Typography>
                  </Box>
                </Box>
              ))) : (<Box>{t("community.text13")}</Box>)}

            </Paper>
          </Box>
        )}
      </DataLoader>
    </Box>
  );
};

export default MyCommunityPage;
