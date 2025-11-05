import { Box, Tabs, Tab, Paper, Typography, Button } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import RewardHeader from "../../components/RewardHeader";
import { useTranslation } from "react-i18next";
import { useCurrentDate } from "../../hooks/data";
import BottomDialog from "../../components/BottomDialog";
import { useTeamReward } from "../../hooks/useTeamReward";
import { useUserInfo } from "../../hooks/useUserInfo"; // 假设你有获取用户信息的Hook
import { usePoolBalance } from "../../hooks/usePoolBalance";
import { DataLoader } from "../../components/DataLoader";
import GlobalSnackbar from "../../components/GlobalSnackbar";
const Reward = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(0);
  const [poolType, setPoolType] = useState(2)
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  // 获取用户信息（包含等级）
  const { userInfo, loading: userLoading } = useUserInfo();
  const userLevel = userInfo?.user_level; // 假设用户信息中包含level字段
  // 根据选中的Tab决定查询哪个奖池
  const getPoolTypeByTab = (tabIndex) => {
    switch (tabIndex) {
      case 0: return 2; // 大单奖励
      case 1: return 3; // 永动奖
      default: return 2;
    }
  };
  const {
    balance,
    changePoolType,
    loading: balanceLoading,
    error: balanceError,
    poolTypeName
  } = usePoolBalance(poolType);
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
  } = useTeamReward("teamUser", 1, 10, userLevel);
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
    setPoolType(getPoolTypeByTab(newValue))
    changePoolType(getPoolTypeByTab(newValue), userLevel)
    changeRewardType(rewardType);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const currentDate = useCurrentDate();
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
      amount: "120",
      coins: "666川普币",
      date: "2025/11/11",
    },
    {
      id: 2,
      type: "质押",
      amount: "120",
      coins: "666川普币",
      date: "2025/11/11",
    },
    {
      id: 3,
      type: "质押",
      amount: "120",
      coins: "666川普币",
      date: "2025/11/11",
    },
    {
      id: 4,
      type: "质押",
      amount: "120",
      coins: "666川普币",
      date: "2025/11/11",
    },
  ];
  const levels = [
    { label: "F1", icon: "F1.png" },
    { label: "F2", icon: "F2.png" },
    { label: "F3", icon: "F3.png" },
    { label: "F4", icon: "F4.png" },
    { label: "F5", icon: "F5.png" },
    { label: "F6", icon: "F6.png" },
    { label: "F7", icon: "F7.png" },
    { label: "F8", icon: "F8.png" },
    { label: "F9", icon: "F9.png" },
  ];

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setToast({ open: true, message: '质押成功！', type: 'success' });
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
        loadingText={`加载中...`}
        errorText={`加载失败`}
      >
        {rewardData => (<Box>
          {/* Stat card */}
          <Box
            sx={{
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
                textAlign: "center",
                bgcolor: "rgba(255, 255, 255, 0.40)",
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
              {tab === 1 && (
                <Box sx={{ width: "100%", overflow: "hidden" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="scrollable auto tabs example"
                    sx={{
                      backgroundColor: "#FFF",
                      borderRadius: "40px",
                      p: "6px",
                      minHeight: "44px",
                      marginBottom: "14px",
                      "& .MuiTabs-indicator": {
                        // display: "none", // 隐藏默认的底部指示器
                        backgroundColor: "rgba(160, 105, 246, 1)"
                      },
                      "& .MuiTabs-scrollButtons.Mui-disabled": {
                        opacity: 0.3
                      }
                    }}
                  >
                    {levels.map((item) => (
                      <Tab
                        key={item.label}
                        label={item.label}
                        iconPosition="start"
                        icon={
                          <img
                            src={require(`../../static/image/pages/level/${item.icon}`)}
                            alt={item.label}
                            style={{ width: 28, height: 28 }}
                          />
                        }
                        sx={{
                          minHeight: "36px",
                          textTransform: "none",
                          fontSize: "14px",
                          fontWeight: 500,
                          "&.Mui-selected": { color: "#7a63ff" },
                        }}
                      />
                    ))}</Tabs>
                </Box>
              )}
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  color: "#888",
                  fontSize: "13px",
                }}
              >
                {tab === 0 ? t("reward.text5") : t("reward.text6")}
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
                50%{t("reward.text7")}
              </Typography>
              <Typography
                sx={{
                  color: "#333",
                  fontSize: "36px",
                  fontWeight: "600",
                }}
              >
                {balance.total_amount}
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
                {tab === 0 ? t("reward.text8") : '当前等级'}
              </Typography>

              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {tab === 0 ? rewardData.extra.invite_count + t("reward.text9") : rewardData.extra.level}
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
                {tab === 0 ? t("reward.text10") : '大区贡献值'}
              </Typography>
              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {tab === 0 ? rewardData.extra.can_get_count + t("reward.text11") : rewardData.extra.big_region}
              </Typography>
            </Box>
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
                {tab === 0 ? t("reward.text12") : '小区贡献值'}
              </Typography>

              <Typography
                variant="body2"
                style={{ color: "#333", fontSize: "14px" }}
              >
                {tab === 0 ? rewardData.extra.total_amount + t("trump") : rewardData.extra.small_region}
              </Typography>
            </Box>
            {tab === 1 && (
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
                  {'当前可提现数'}
                </Typography>

                <Typography
                  variant="body2"
                  style={{ color: "#333", fontSize: "14px" }}
                >
                  {rewardData.extra.balance + t("trump")}
                </Typography>
              </Box>
            )}
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
                  <Typography sx={{ color: "#888", fontSize: "13px" }}>
                    {"转出记录>"}
                  </Typography>
                </Box>

                {/* <Divider sx={{ mb: 2 }} /> */}
                {rewardData.list.length > 0 ? (
                  rewardData.list.map((item, index) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        bgcolor: "#fff",
                        borderRadius: "12px",
                        p: "16px",
                        alignItems: "center",
                        mb: index === contributionData.length - 1 ? 0 : "12px",
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
                              {item.user_level + '代'}
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
                  <Typography sx={{ color: "#888", fontSize: "13px" }}>
                    {"转出记录>"}
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
                        index === staticEarningsData.dividends.length - 1
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
                ))) : (<Box>暂无数据</Box>)}

              </Box>
            )}
          </Box>
        </Box>)}

      </DataLoader>
      <GlobalSnackbar
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.type}
      />
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

    </Box >
  );
};

export default Reward;
