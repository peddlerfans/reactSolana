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
import AssignmentIcon from "@material-ui/icons/Assignment";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BottomDialog from "../../components/BottomDialog";
import { makeStyles } from "@material-ui/core/styles";
import daoIcon from "../../static/image/pages/daoIcon.png";
import { useCurrentDate } from "../../hooks/data";
import { usePoolBalance } from "../../hooks/usePoolBalance";
import { DataLoader } from "../../components/DataLoader";
import { useNftList } from "../../hooks/useNftList";
import { useIncome } from "../../hooks/useIncome";
import { useWithdraw } from "../../hooks/useWithdraw";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useSnackbar } from "../../utils/SnackbarContext";
import { useLoading } from "../../utils/LoadingContext";
import LoadMore from "../../components/LoadMore";
import { useWalletReady } from "../../utils/WalletReadyContext";
import { useUser } from "../../utils/UserContext";
import { formatAddress } from '../../utils/format';
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
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const { withdraw } = useWithdraw()
  const { isLoggedIn, userInfo } = useUser(); // 获取登录状态和用户信息
  const { walletReady } = useWalletReady();
  const {
    balance,
    loading,
    error,
    refetch
  } = usePoolBalance(7);

  const {
    nftData,
    loading: nftLoading,
    error: nftError,
    pagination,
    loadMore,
    refetch: nftRefetch,
  } = useNftList(1, 10);
  const {
    incomeData,
    incomeList,
    loading: incomeLoading,
    error: incomeError,
    pagination: incomePagination,
    loadMore: incomeLoadMore,
    refetch: incomeRefetch,
  } = useIncome(7, 1, 10);

  useEffect(() => {
    console.log("NFT页面: 登录状态变化", {
      isLoggedIn,
      hasUserInfo: !!userInfo,
      walletReady
    });

    if (isLoggedIn && userInfo) {
      console.log("NFT页面: 用户已登录，重新请求数据");
      refetch();
      nftRefetch()
      incomeRefetch();
    }
  }, [isLoggedIn, userInfo]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const handleOpen = () => {
    if (!Number(balance.account_balance)) {
      showSnackbar(t("error.text9"), 'error')
      return
    }
    if (!Number(balance.left_reward_balance)) {
      showSnackbar(t("error.text10"), 'error')
      return
    }
    setDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleConfirm = async () => {
    showLoading(t('hooks.text3'));
    try {
      const res = await withdraw('7');
      console.log("成功提现:", res);
      if (res.code === 200) {
        showSnackbar(t('withdraw.text1'), 'success')
      } else {
        showSnackbar(res.msg, 'error')
      }
      handleCloseDialog();
      refetch(); // 刷新页面余额
      nftRefetch();
      incomeRefetch()
    } catch (err) {
      console.error("提现失败:", err);
    } finally {
      hideLoading()
    }
  };

  const goPage = () => {
    navigate(`/h5/asset?type=7`)
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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          {/* <IconButton
            style={{ color: "#333" }}
            onClick={() => {
              navigate("/h5/nftTransfer");
            }}
          >
            <AssignmentIcon />
          </IconButton> */}
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
          {t("nft.text1")}
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
        error={error}
        onRetry={refetch}
        data={balance}
        loadingText={t('loading')}
        errorText={t('nft.text3')}
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
              {t("nft.text4")}
            </Typography>
            <Typography
              sx={{
                bgcolor: "#E8DAFF",
                borderRadius: "6px",
                color: "#A069F6",
                px: "8px",
                py: "5px",
                width: "72px",
                my: "10px",
                fontSize: "13px",
              }}
            >
              {balance?.f_percent + '%' + t("nft.text5")}
            </Typography>
            <Typography
              sx={{
                color: "#333",
                fontSize: "36px",
                fontWeight: "600",
              }}
            >
              {balance?.total_amount || 0}
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
              {t("reward.text12")}
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "#333", fontSize: "14px" }}
            >
              {balance?.account_balance + t("trump")}
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
              {t('assets.text5')}
            </Typography>

            <Typography
              variant="body2"
              style={{ color: "#A069F6", fontSize: "14px" }}
            >
              {balance?.left_reward_balance + t("trump")}
            </Typography>
          </Box>
          <Button
            onClick={() => handleOpen()}
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
            {t("nft.text7")}
          </Button>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={() => handleOpenDialog('outNft')}
              variant="contained"
              sx={{
                px: '48px',
                py: '10px',
                bgcolor: "#CFF174",
                color: "#333",
                fontWeight: "bold",
                borderRadius: "30px",
                boxShadow: "none",
                fontSize: '15px'
              }}
            >
              {t("nft.text6")}
            </Button>

            <Button
              onClick={() => handleOpenDialog('transferOut')}
              variant="contained"
              sx={{
                px: '48px',
                py: '10px',
                bgcolor: "#CFF174",
                color: "#333",
                fontWeight: "bold",
                borderRadius: "30px",
                boxShadow: "none",
                fontSize: '15px'
              }}
            >
              {t('nft.text7')}
            </Button>
          </Box> */}
          <Typography sx={{ textAlign: "center", color: "#999", fontSize: "13px", mt: "17px" }} onClick={goPage}>{t("transferOutList")}</Typography>
        </Box>)}

      </DataLoader>


      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#A069F6",
            width: "44px"
          }
        }}
      >
        <Tab
          label={t("nft.text8")}
          sx={{
            minHeight: "32px",
            "&.Mui-selected": {
              color: "#333",
            },
            "&:not(.Mui-selected)": {
              color: "#888",
            },
          }}
        />
        <Tab
          label={t('nft.text9')}
          sx={{
            minHeight: "32px",
            "&.Mui-selected": {
              color: "#333",
            },
            "&:not(.Mui-selected)": {
              color: "#888",
            },
          }}
        />
      </Tabs>

      <Box>
        {tab === 0 && (
          // 在你的组件中
          <Paper sx={{ borderRadius: 2, boxShadow: "none", p: 2, backgroundColor: "#F1EFF9" }}>
            <List sx={{ py: 0 }}>
              <DataLoader
                loading={nftLoading}
                error={nftError}
                onRetry={nftRefetch}
                data={nftData}
                loadingText={t("loading")}
                errorText={t("loadError")}
              >
                {nftData?.map((item, index) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      display: "flex",
                      bgcolor: "#FFF",
                      borderRadius: "12px",
                      display: "block",
                      p: "16px",
                      mb: index === nftData?.length - 1
                        ? 0 : "12px"
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <img src={item.icon_path} width={'64px'} height={"64px"} alt="" />

                      <Box sx={{ ml: "10px",flex:1, display: "flex", justifyContent: "space-between" ,alignItems:'center'}}>
                        <Box>
                          {/* 名称 */}
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "16px",
                              color: "#333",
                              fontWeight: "bold",
                              mb: 1
                            }}
                          >
                            {item.name || 'NFT'}
                          </Typography>

                          {/* 地址 */}
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "13px",
                              color: "#666",
                              mb: 1,
                            }}
                          >
                            {formatAddress(item.address)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "15px",
                              color: "#9ACD12",
                              mb: 1,
                            }}
                          >
                            {'X'+item.amount}
                          </Typography>
                        </Box>

                      </Box>
                    </Box>

                  </ListItem>
                ))}
              </DataLoader>
              <LoadMore
                loading={nftLoading}
                hasMore={pagination.hasMore}
                onLoadMore={loadMore}
              />
            </List>
          </Paper>
        )}

        {tab === 1 && (
          <Paper sx={{ borderRadius: 2, boxShadow: "none", p: 2, backgroundColor: "#F1EFF9" }}>
            <List sx={{ py: 0 }}>
              <DataLoader
                loading={incomeLoading}
                error={incomeError}
                onRetry={incomeRefetch}
                data={incomeData}
                loadingText={t("loading")}
                errorText={t("loadError")}
              >
                {incomeData => (
                  incomeData.map((item, index) => (
                    <ListItem key={item.id} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderRadius: '12px',
                      p: '16px',
                      alignItems: 'center', bgcolor: '#fff',
                      mb: index === incomeData.length - 1
                        ? 0 : "12px"
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                        <img src={require("../../static/image/pages/nftIcon.png")} alt="" width={20} height={20} />
                        <Box sx={{ ml: "10px" }}>
                          <Typography sx={{ fontSize: '14px', color: '#333' }} >{t("nft.text10")}</Typography>
                          <Typography sx={{
                            width: '40px',
                            height: '20px',
                            color: '#A069F6',
                            borderRadius: '4px',
                            fontSize: '13px',
                            bgcolor: 'rgba(160, 105, 246, 0.15)',
                            lineHeight: '20px', textAlign: 'center'
                          }}>{Number(item.extra_info.my_percent) * 100 + '%'}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                        <Typography sx={{ fontSize: '15px', color: '#9ACD12' }}>{t('reward.text15', { value: item.amount })}</Typography>
                        <Typography sx={{ fontSize: '14px', color: '#999' }}>{item.create_time}</Typography>
                      </Box>
                    </ListItem>
                  ))

                )}

              </DataLoader>
              <LoadMore
                loading={incomeLoading}
                hasMore={incomePagination.hasMore}
                onLoadMore={incomeLoadMore}
              />
            </List>
          </Paper>
        )}
      </Box>
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
      ></ConfirmDialog>
    </Box>
  );
}
