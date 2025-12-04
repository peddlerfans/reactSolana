import {
  Box,
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
import daoIcon from "../../static/image/pages/airdropIcon.png";
import { useCurrentDate } from "../../hooks/data";
import { DataLoader } from "../../components/DataLoader";
import PasswordDialog from '../../components/PasswordDialog';
import { useSnackbar } from "../../utils/SnackbarContext";
import { useLoading } from "../../utils/LoadingContext";
import { useAirdropAdvanced } from '../../hooks/useAirdrop';
import { useWalletReady } from "../../utils/WalletReadyContext";
import { useUser } from "../../utils/UserContext";
import LoadMore from "../../components/LoadMore";
import { formatAddress } from '../../utils/format';
import airDropImage from "../../static/image/fiting/airDropImage.png"
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

  statCard: {
    borderRadius: 12,
    padding: "16px 12px",
    background:
      "linear-gradient(83deg, #E0E4FC 1.6%, #E8E3F7 50.11%, #E6F3EF 98.63%)",
    boxShadow: "0 6px 20px rgba(79,67,141,0.08)",
  },
  statHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  countdown: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#666",
  },
  bigNumber: {
    fontSize: 34,
    fontWeight: 700,
    textAlign: "center",
  },
  percentBadge: {
    display: "inline-block",
    background: "rgba(233,216,255,0.9)",
    margin: "10px 0",
    padding: "6px 9px",
    borderRadius: 12,
    fontSize: 12,
    color: "#A069F6",
  },

  pillTab: {
    flex: 1,
    textTransform: "none",
    minHeight: 36,
    borderRadius: 12,
    margin: 4,
    fontWeight: 600,
    background: "transparent",
    "&.Mui-selected": {
      background: "linear-gradient(90deg,#f3e9ff,#efe8ff)",
      color: "#A069F6",
      boxShadow: "0 6px 12px rgba(111,47,181,0.08)",
    },
  },
}));

export default function NftPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentDate = useCurrentDate();
  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState("")
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const { isLoggedIn, userInfo } = useUser(); // 获取登录状态和用户信息
  const { walletReady } = useWalletReady();
  const {
    airdropList,
    airdropRecords,
    loading,
    claimLoading,
    getAirdropList,
    claimAirdrop,
    pagination,
    loadMoreRecords,
    getAirdropRecords
  } = useAirdropAdvanced();
  useEffect(() => {
    // 组件加载时获取数据
    getAirdropList();
    getAirdropRecords();
  }, []);
  const handleClose = () => {
    setAddressOpen(false);
  };
  const handleConfirm = async () => {
    showLoading(t('loading'));
    try {
      if(!airdropList[0]?.id){
        showSnackbar(t("990402"),'error')
        handleClose();
        setAddress("")
        return
      }
      const res = await claimAirdrop({ acq_addr: address, airdrop_id: airdropList[0]?.id || "" });
      if(res.code === 200){
        showSnackbar(t('error.text12'),'success')
      }else{
        setAddress("")
        showSnackbar(t(`${res.code}`),'error')
      }
      handleClose();
      getAirdropRecords(); // 刷新页面余额
    } catch (err) {
      console.error("提现失败:", err);
    } finally {
      hideLoading()
    }
  };

  const handlePwdInputChange = (event) => {
    setAddress(event.target.value);
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
      getAirdropList();
      getAirdropRecords();
    }
  }, [isLoggedIn, userInfo]);
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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Top banner */}
      <Box className={classes.topBanner}>
        <Typography
          style={{
            maxWidth: "250px",
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
          {t("airdrop.text8", { value: airdropList[0]?.link_name })}
        </Typography>

        <img
          src={daoIcon}
          alt={t('nft.text3')}
          width={160}
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
        onRetry={getAirdropList}
        data={airdropList}
        loadingText={t('loading')}
        errorText={t('nft.text3')}
      >
        {/* Stat card */}
        {airdropList => (<Box
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
          {/* 中间box */}
          <Box
            sx={{
              textAlign: "center",
              bgcolor: "#EEEDF4",
              borderRadius: "10px",
              py: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "12px",
              marginBottom: "16px",
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                color: "#888",
                fontSize: "13px",
              }}
            >
              {t("airdrop.text6")}
            </Typography>
            <Typography
              sx={{
                color: "#333",
                fontSize: "36px",
                fontWeight: "600",
              }}
            >
              {airdropList[0]?.total_quantity || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "20px"
            }}
          >
            <Typography
              variant="body2"
              style={{ color: "#888", fontSize: "14px" }}
            >
              {t("airdrop.text3")}
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "#333", fontSize: "14px" }}
            >
              {airdropList[0]?.total_quantity || 0 + t("trump")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "20px"
            }}
          >
            <Typography
              variant="body2"
              style={{ color: "#888", fontSize: "14px" }}
            >
              {t('airdrop.text2')}
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "#A069F6", fontSize: "14px" }}
            >
              {airdropList[0]?.end_time || 0}
            </Typography>
          </Box>
          {
            airdropList[0]?.airuser?.acq_addr ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: "20px"
                }}
              >
                <Typography
                  variant="body2"
                  style={{ color: "#888", fontSize: "14px" }}
                >
                  {t('airdrop.text7')}
                </Typography>

                <Typography
                  variant="body2"
                  style={{ color: "#A069F6", fontSize: "14px" }}
                >
                  {formatAddress(airdropList[0]?.airuser?.acq_addr)}
                </Typography>
              </Box>
            ) : <Button
              onClick={() => setAddressOpen(true)}
              variant="contained"
              sx={{
                width: "100%",
                mt: "20px",
                bgcolor: "#CFF174",
                color: "#333",
                fontWeight: "bold",
                borderRadius: "30px",
                boxShadow: "none",
                mb: "11px"
              }}
            >
              {t("airdrop.text1")}
            </Button>
          }

        </Box>)}

      </DataLoader>

      <Box>
        <Paper sx={{ borderRadius: 2, boxShadow: "none", p: 2, backgroundColor: "#F1EFF9" }}>
          <List sx={{ py: 0 }}>
            <DataLoader
              loading={loading}
              onRetry={getAirdropRecords}
              data={airdropRecords}
              loadingText={t("loading")}
              errorText={t("loadError")}
            >
              {airdropRecords => (
                airdropRecords.map((item, index) => (
                  <ListItem key={item.id} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderRadius: '12px',
                    p: '16px',
                    alignItems: 'center', bgcolor: '#fff',
                    mb: index === airdropRecords.length - 1
                      ? 0 : "12px"
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                      <img src={require("../../static/image/pages/kongtou.png")} alt="" width={20} height={20} />
                      <Box sx={{ ml: "10px" }}>
                        <Typography sx={{ fontSize: '14px', color: '#333' }} >{item.info.link_name}</Typography>
                        <Typography sx={{
                          width: '40px',
                          height: '20px',
                          color: '#A069F6',
                          borderRadius: '4px',
                          fontSize: '13px',
                        }}>{formatAddress(item.info.contract_addr)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                      <Typography sx={{ fontSize: '14px', color: '#999' }}>{item.update_time}</Typography>
                      <Typography sx={{ fontSize: '15px', color: '#9ACD12' }}>{item.quantity}</Typography>
                    </Box>
                  </ListItem>
                ))

              )}

            </DataLoader>
            <LoadMore
              loading={loading}
              hasMore={pagination.hasMore}
            onLoadMore={loadMoreRecords}
            />
          </List>
        </Paper>
      </Box>
      <PasswordDialog
        password={address}
        open={addressOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={t("airdrop.text4")}
        buttonText={t("confirm")}
        inputPlaceholder={t("airdrop.text5")}
        iconImage={airDropImage}
        onInputChange={handlePwdInputChange}
      />
    </Box>
  );
}
