import { Box, Tabs, Tab, Paper, Typography, Button } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import '../../style/swiper.css'
import RewardHeader from "../../components/RewardHeader";
import { useTranslation } from "react-i18next";
import { useCurrentDate } from "../../hooks/data";
import BottomDialog from "../../components/BottomDialog";
import { useTeamReward } from "../../hooks/useTeamReward";
import { useUserInfo } from "../../hooks/useUserInfo"; // 假设你有获取用户信息的Hook
import { DataLoader } from "../../components/DataLoader";
import { usePoolBalance } from "../../hooks/usePoolBalance";
import { useWithdraw } from "../../hooks/useWithdraw";
import { getCurrentDate } from "../../utils/format";
import { useSnackbar } from "../../utils/SnackbarContext";
import { useLoading } from "../../utils/LoadingContext";
import LoadMore from "../../components/LoadMore";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useUser } from "../../utils/UserContext";
import { useWalletReady } from "../../utils/WalletReadyContext";
const Reward = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading()
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  // 获取用户信息（包含等级）
  const { userInfo, loading: userLoading } = useUserInfo();
  const { isLoggedIn, userInfo: getUserInfo } = useUser(); // 获取登录状态和用户信息
  const { walletReady } = useWalletReady()
  const userLevel = userInfo?.user_level; // 假设用户信息中包含level字段
  const {
    rewardData,
    rewardList,
    loading,
    error,
    pagination,
    changeRewardType,
    loadMore,
    refetch,
    getRewardTypeText
  } = useTeamReward("teamUser", 1, 10, (userLevel || "F9"));
  const { withdraw } = useWithdraw()
  const { balance, loading: balanceLoading, error: balanceError, refetch: balanceRefetch, changePoolType } = usePoolBalance(2)
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    let rewardType;
    switch (newValue) {
      case 0:
        rewardType = "teamUser";
        break;
      case 1:
        rewardType = "teamLevel";
        break;
      default:
        rewardType = "teamUser";
    }
    if (newValue === 0) {
      changePoolType(2)
    } else {
      changePoolType(3, "F9")
    }
    changeRewardType(rewardType, userInfo?.user_level);
  };

  const currentDate = useCurrentDate();
  const levels = [
    { level: "F9", color: "linear-gradient(270deg, #8D8D74 0%, #272720 100%)", icon: require("../../static/image/pages/level/F9.png") },
    { level: "F8", color: "linear-gradient(270deg, #B08564 0%, #4A382A 100%)", icon: require("../../static/image/pages/level/F8.png") },
    { level: "F7", color: "linear-gradient(270deg, #8D94BB 0%, #404355 100%)", icon: require("../../static/image/pages/level/F7.png") },
    { level: "F6", color: "linear-gradient(270deg, #E8C97B 0%, #4D3B00 100%)", icon: require("../../static/image/pages/level/F6.png") },
    { level: "F5", color: "linear-gradient(270deg, #81A3DF 0%, #363C58 100%)", icon: require("../../static/image/pages/level/F5.png") },
    { level: "F4", color: "linear-gradient(270deg, #6B8CF8 0%, #243A68 100%)", icon: require("../../static/image/pages/level/F4.png") },
    { level: "F3", color: "linear-gradient(270deg, #A974DF 0%, #491974 100%)", icon: require("../../static/image/pages/level/F3.png") },
    { level: "F2", color: "linear-gradient(270deg, #9F3085 0%, #4E0D40 100%)", icon: require("../../static/image/pages/level/F2.png") },
    { level: "F1", color: "linear-gradient(270deg, #7B5711 0%, #5C0922 100%)", icon: require("../../static/image/pages/level/F1.png") },
  ];
  // 安全处理：当 pool_total_amount 不存在、不是数组或为 0 时 fallback 为空数组，同时默认 account_balance 为 0
  const poolMap = Object.fromEntries(
    (Array.isArray(balance?.pool_total_amount) ? balance.pool_total_amount : [])
      .filter(item => item?.level_name)
      .map(item => {
        const { level_name, account_balance, f_percent } = item;
        return [
          level_name,
          {
            amount: Number(account_balance) || 0,
            f_percent: Number(f_percent) || 0,
          },
        ];
      })
  );

  const handleOpenDialog = () => {
    if (!Number(balance.account_balance) && tab === 0) {
      showSnackbar(t("error.text9"), 'error')
      return
    }
    if (!Number(balance.left_reward_balance) && tab === 0) {
      showSnackbar(t("error.text10"), 'error')
      return
    }
    if (tab === 1 && !Number(poolMap[userLevel]?.amount)) {
      showSnackbar(t("error.text9"), 'error')
      return
    }
    if (tab === 1 && !Number(poolMap[userLevel]?.amount)) {
      showSnackbar(t("error.text9"), 'error')
      return
    }
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleConfirm = async () => {
    showLoading(t('hooks.text3'));
    try {
      const type = tab === 0 ? '2' : userLevel
      const res = await withdraw(type);
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
      hasUserInfo: !!getUserInfo,
      walletReady
    });

    if (isLoggedIn && getUserInfo) {
      console.log("用户已登录，重新请求数据");
      refetch();
      balanceRefetch();
    }
  }, [isLoggedIn, getUserInfo]);

  const goPage = () => {
    navigate(`/h5/asset?type=${tab + 2}`)
  }


  //加载更多
  const loadMoreRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading && pagination.hasMore) {
          loadMore();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loading, pagination.hasMore, loadMore]);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      {/* 顶部导航 */}
      <RewardHeader title={t("reward.text1")} />
      <Box sx={{ px: "12px" }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            backgroundColor: "#FFF",
            borderRadius: "20px",
            p: "6px",
            minHeight: "44px",
            marginBottom: "14px",
            "& .MuiTabs-indicator": {
              display: "none", // 隐藏默认的底部指示器
            },
          }}
        >
          <Tab
            label={t("reward.text2")}
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
            label={t("reward.text3")}
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
      </Box>

      <DataLoader
        loading={loading}
        error={error}
        onRetry={refetch}
        data={rewardData}
        loadingText={t('loading')}
        errorText={t('loadError')}
      >
        {rewardData => (<Box>
          {/* Stat card */}
          {tab === 1 && (
            <Swiper
              // slidesPerView={'auto'}
              // slidesPerView={1}
              centeredSlides={true}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
              style={{
                margin: "0 12px",
                paddingBottom: "30px", // 给指示器预留空间
              }}
            >
              <DataLoader
                loading={balanceLoading}
                error={balanceError}
                onRetry={balanceRefetch}
                data={balance}
                loadingText={t('loading')}
                errorText={t('loadError')}
              >
                {
                  levels.map((item, index) => (
                    <SwiperSlide
                      key={index}
                      style={{
                        width: "100%",
                        height: "140px",
                        borderRadius: "16px",
                        background: item.color,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0",
                        color: "#fff",
                      }}
                    >
                      {/* 左侧信息 */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px", ml: "16px" }}>
                        <Typography sx={{ fontSize: "18px", fontWeight: "bold", display: "flex", fontStyle: "italic" }}>
                          <Typography sx={{
                            fontSize: "14px",
                            px: "8px", py: "2px",
                            fontWeight: "600",
                            bgcolor: "rgba(255, 255, 255, 0.40)",
                            borderRadius: "4px", mr: "6px"
                          }}>{item.level} </Typography>
                          {t('reward.text16')}</Typography>
                        <Typography sx={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.40)" }}>{getCurrentDate()}</Typography>
                        <Typography sx={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.80)" }}>{t('reward.text17') + (poolMap[item.level]?.f_percent ?? 0) + '%'}</Typography>
                        <Typography sx={{ fontSize: "28px" }}>
                          {poolMap[item.level]?.amount ?? 0}
                        </Typography>
                      </Box>

                      {/* 右侧图标 */}
                      <Box>
                        <img
                          src={item.icon}
                          alt={item.level}
                          style={{
                            width: "120px",
                            height: "106px",
                            objectFit: "contain",
                            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
                          }}
                        />
                      </Box>
                    </SwiperSlide>
                  ))
                }
              </DataLoader>
            </Swiper>
          )}
          <Box
            sx={{
              mt: "12px",
              mx: "12px",
              px: "12px",
              py: "16px",
              borderRadius: "12px",
              background:
                "linear-gradient(83deg, #E0E4FC 1.6%, #E8E3F7 50.11%, #E6F3EF 98.63%)",
              boxShadow: "0 6px 20px rgba(79,67,141,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: "20px"
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
                  {t("reward.text4")}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2">{currentDate}</Typography>
              </Box>
            </Box>
            {/* 中间box */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#888", fontSize: "14px" }}
              >
                {tab === 0 ? t("reward.text8") : t('reward.text18')}
              </Typography>

              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {tab === 0 ? rewardData.extra.invite_count + t("reward.text9") : userLevel || t("reward.text22")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#888", fontSize: "14px" }}
              >
                {tab === 0 ? t("reward.text10") : t('reward.text20')}
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {tab === 0 ? rewardData.extra.can_get_count + t("reward.text11") : rewardData.extra.big_region}
              </Typography>
            </Box>
            {tab === 1 && (<Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                variant="body2"
                style={{ color: "#888", fontSize: "14px" }}
              >
                {t('reward.text21')}
              </Typography>

              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {rewardData.extra.small_region}
              </Typography>
            </Box>)}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
                {tab === 0 ? balance.account_balance + t("trump") : poolMap[userLevel]?.amount || 0 + t("trump")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "20px"
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
                {balance.left_reward_balance + t("trump")}
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
              {t("assets.text7")}
            </Button>
          </Box>

          <Box
            sx={{
              mt: "20px",
              px: "12px",
              paddingTop: "24px",
              minHeight: "400px",
            }}
          >
            {/* 静态收益 Tab */}
            {tab === 0 && (
              <Box sx={{ borderRadius: 2, boxShadow: "none", width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: "20px",
                  }}
                >
                  <Typography
                    variant="body1"
                    // eslint-disable-next-line no-dupe-keys
                    sx={{ color: "#333", fontSize: "17px" }}
                  >
                    {t("reward.text14")}
                  </Typography>
                  <Typography sx={{ color: "#888", fontSize: "13px" }} onClick={goPage}>
                    {t('transferOutList')}
                  </Typography>
                </Box>

                {/* <Divider sx={{ mb: 2 }} /> */}
                {rewardList?.length > 0 ? (
                  rewardList.map((item, index) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        bgcolor: "#fff",
                        borderRadius: "12px",
                        p: "16px",
                        alignItems: "center",
                        mb: index === rewardList.length - 1 ? 0 : "12px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={require("../../static/image/pages/rewardTeam.png")}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <Box sx={{ ml: "10px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontSize: "14px", color: "#333" }}
                            >
                              {item.user_level + t('reward.text11') || "F9"}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: "14px",
                                color: "#A069F6",
                                width: "40px",
                                px: "10px",
                                py: "4px",
                                bgcolor: "rgba(160, 105, 246, 0.15)",
                                textAlign: "center",
                                borderRadius: "4px",
                                ml: "3px",
                              }}
                            >
                              {item.level_percent + '%'}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body1"
                            sx={{ fontSize: "14px", color: "#444" }}
                          >
                            {item.user.mail}
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
                          {t("reward.text13", { value: item.pledge.amount })}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#444",
                            textAlign: "end",
                            fontSize: "14px",
                          }}
                        >
                          {item.amount}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (<Box></Box>)}
                <LoadMore
                  loading={loading}
                  hasMore={pagination.hasMore}
                  onLoadMore={loadMore}
                />
              </Box>
            )}

            {/* 贡献记录 Tab */}
            {tab === 1 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
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
                  <Typography
                    variant="body1"
                    // eslint-disable-next-line no-dupe-keys
                    sx={{ color: "#333", fontSize: "17px" }}
                  >
                    {t("reward.text14")}
                  </Typography>
                  <Typography sx={{ color: "#888", fontSize: "13px" }} onClick={goPage}>
                    {t('transferOutList')}
                  </Typography>
                </Box>
                {rewardData.list.length > 0 ? (rewardData.list.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      boxShadow: "none",
                      bgcolor: "#fff",
                      borderRadius: "12px",
                      p: "16px",
                      mb:
                        index === rewardData.list.length - 1
                          ? 0
                          : "12px",
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
                          src={require("../../static/image/pages/rewardRating.png")}
                          alt=""
                          width={26}
                          height={26}
                          style={{
                            marginRight: "10px",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "14px",
                              color: "#333",
                            }}
                          >
                            {item.user_level}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: "14px",
                              color: "#A069F6",
                              width: "40px",
                              px: "10px",
                              py: "4px",
                              bgcolor: "rgba(160, 105, 246, 0.15)",
                              textAlign: "center",
                              borderRadius: "4px",
                              ml: "3px",
                            }}
                          >
                            {item.level_percent + '%'}
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
                          {t("reward.text15", { value: item.amount })}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#999",
                            textAlign: "end",
                            fontSize: "14px",
                          }}
                        >
                          {item.create_time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))) : (<Box>{t('noData')}</Box>)}
                <LoadMore
                  loading={loading}
                  hasMore={pagination.hasMore}
                  onLoadMore={loadMore}
                />
              </Box>
            )}
          </Box>
        </Box>)}

      </DataLoader>
      {/* <BottomDialog
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
      /> */}
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
      >

      </ConfirmDialog>
    </Box >
  );
};

export default Reward;
