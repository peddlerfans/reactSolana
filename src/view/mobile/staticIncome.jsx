import {
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Paper,
  List,
  ListItem
} from "@mui/material";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import daoIcon from "../../static/image/pages/staticIcon.png";
import { useCurrentDate } from "../../hooks/data";
import { usePoolBalance } from "../../hooks/usePoolBalance";
import { useIncome } from "../../hooks/useIncome";
import { useWithdraw } from "../../hooks/useWithdraw";
import { DataLoader } from "../../components/DataLoader";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useSnackbar } from "../../utils/SnackbarContext";
import { useLoading } from "../../utils/LoadingContext";
import { useWalletReady } from "../../utils/WalletReadyContext";
import { useUser } from "../../utils/UserContext";
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    background: "#f2f2f6",
    paddingBottom: 32,
    width: "100%",
    backgroundSize: "100% 640px",
    backgroundRepeat: "no-repeat",
  },

  // Top banner
  topBanner: {
    borderRadius: 12,
    marginLeft: "12px",
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    paddingTop: "30px",
    paddingBottom: "32px",
  },
}));

export default function NftPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar()
  const { showLoading, hideLoading } = useLoading()
  const { t } = useTranslation();
  const currentDate = useCurrentDate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isLoggedIn, userInfo } = useUser(); // 获取登录状态和用户信息
  const { walletReady } = useWalletReady();

  const {
    balance,
    loading,
    error,
    refetch
  } = usePoolBalance(1);
  const {
    incomeData,
    loading: incomeLoading,
    error: incomeError,
    refetch: incomeRefetch,
    loadMore
  } = useIncome(1)
  const { withdraw, loading: withdrawLoading } = useWithdraw();
  const handleOpenDialog = (() => {
    if (!Number(balance.account_balance)) {
      showSnackbar(t("error.text9"), 'error')
      return
    }
    if (!Number(balance.left_reward_balance)) {
      showSnackbar(t("error.text10"), 'error')
      return
    }
    setDialogOpen(true);
  });

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleConfirm = async () => {
    showLoading(t('hooks.text3'));
    try {
      const res = await withdraw('1');
      console.log("成功提现:", res);
      if (res.code === 200) {
        showSnackbar(t('withdraw.text1'), 'success')
      } else {
        showSnackbar(res.msg, 'error')
      }
      handleCloseDialog();
      refetch(); // 刷新页面余额
    } catch (err) {
      console.error("提现失败:", err);
    } finally {
      hideLoading()
    }
  };

  // 🌟 关键：监听登录状态变化，重新请求数据
  useEffect(() => {
    console.log("登录状态变化", {
      isLoggedIn,
      hasUserInfo: !!userInfo,
      walletReady
    });

    if (isLoggedIn && userInfo) {
      console.log("用户已登录，重新请求数据");
      refetch();
      incomeRefetch();
    }
  }, [isLoggedIn, userInfo]); // 监听登录状态和用户信息变化
  // useEffect(() => {
  //   if (walletReady) {
  //     console.log("钱包准备好了，自动重新请求数据");
  //     refetch();
  //     incomeRefetch();
  //   }
  // }, [walletReady, refetch, incomeRefetch]);

  const goPage = () => {
    navigate("/h5/asset?type=1")
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Top banner */}
      <Box className={classes.topBanner}>
        <Typography
          style={{
            fontSize: "32px",
            // color: "#6f2fb5",
            fontWeight: 800,
            fontFamily: "YouSheBiaoTiHei,Arial, sans-serif",
            // color: "linear-gradient(270deg, #312562 0%, #764EB5 100%)",
            background: "linear-gradient(270deg, #312562 0%, #764EB5 100%)", // 渐变背景
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-block", // 重要：确保背景裁剪生效
          }}
        >
          {t('static.text1')}
        </Typography>

        <img
          src={daoIcon}
          alt={t('loadError')}
          width={158}
          height={158}
          style={{
            position: "absolute",
            right: "0",
            top: "-21px",
            zIndex: '9'
          }}
        />
      </Box>
      <DataLoader
        loading={loading}
        error={error}
        refetch={refetch}
        data={balance}
      >
        {/* Stat card */}
        {balance => (<Box
          sx={{
            mx: "12px",
            px: "12px",
            py: "16px",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(79,67,141,0.08)",
            zIndex: '10',
            position: "relative",
            border: "1px solid #fff",
            background: "rgba(255, 255, 255, 0.70)",
            backdropFilter: "blur(20px)",
            flexShrink: "0",
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
                mb: "20px"
              }}
            >
              <img
                src={require("../../static/image/pages/coin.png")}
                alt=""
                width={24}
                height={24}
                style={{
                  marginRight: "6px",
                }}
              />
              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {t("nft.text2")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2">{currentDate}</Typography>
            </Box>
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
              {t('static.text2')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
              {balance.person_contribution_value}
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
              {t('static.text3')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
              {balance.total_contribution + t("trump")}
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
              {t('assets.text3')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
              {balance.account_balance + t("trump")}
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
              {t('assets.text5')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", color: "#A069F6" }}>
              {balance.left_reward_balance + t("trump")}
            </Typography>
          </Box>
          <Button
            onClick={() => handleOpenDialog('transferIn')}
            variant="contained"
            sx={{
              width: "100%",
              mt: "20px",
              bgcolor: "#CFF174",
              color: "#FFF",
              fontWeight: "bold",
              borderRadius: "30px",
              boxShadow: "none",
              mb: "11px"
            }}
          >
            {t('assets.text7')}
          </Button>
        </Box>)}
      </DataLoader>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "28px", mx: "12px" }}>
        <Typography sx={{ color: "#333", fontSize: "17px" }}>{t('static.text4')}</Typography>
        <Typography sx={{ color: "#888", fontSize: "13px" }} onClick={goPage}>{t('transferOutList')}</Typography>
      </Box>

      <DataLoader
        loading={incomeLoading}
        error={incomeError}
        data={incomeData}
        refetch={incomeRefetch}
      >
        <Box>
          <Paper sx={{ borderRadius: 2, boxShadow: "none", p: 2, backgroundColor: "#F1EFF9" }}>
            <List sx={{ py: 0 }}>
              {incomeData?.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{
                    bgcolor: "#FFF",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: "16px",
                    mb: index === incomeData?.length - 1
                      ? 0 : "12px"
                  }}
                >
                  <Box sx={{
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <img src={require("../../static/image/pages/staticItem.png")} alt="" width={20} height={20} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "14px",
                        color: "#444",
                        ml: "10px",
                      }}
                    >
                      {t('assets.text22')}
                    </Typography>
                  </Box>


                  {/* 日期 */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "14px",
                      color: "#95BE25"
                    }}
                  >
                    {item.amount}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>

        </Box>
      </DataLoader>
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
      ></ConfirmDialog>
    </Box>
  );
}
