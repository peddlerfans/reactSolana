// RewardRankingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AssignmentIcon from "@material-ui/icons/Assignment";
import clsx from "clsx";
import RankingTabs from "../../components/PillTab";
import { useRankList } from "../../hooks/useRankList";
import { DataLoader } from "../../components/DataLoader";
import { usePoolBalance } from "../../hooks/usePoolBalance";
import LoadMore from "../../components/LoadMore";
// 本地图片导入（替换为你的真实路径）
import rankImg from "../../static/image/pages/rankImg.png"; // 顶部背景（示例）
import daoIcon from "../../static/image/pages/dao_avatar.png"; // 中间 DAO 圆形图
import first from "../../static/image/pages/first.png";
import second from "../../static/image/pages/second.png";
import three from "../../static/image/pages/three.png";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    background: "#f2f2f6",
    paddingBottom: 32,
    width: "100%",
    backgroundImage: `url(${rankImg})`,
    backgroundSize: "100% 640px",
    backgroundRepeat: "no-repeat",
  },

  toolbar: {
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: "space-between",
    alignItems: "center",
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

  // Ranking list
  rankList: {
    marginTop: "14px",
    borderRadius: 12,
  },
  rankIndex: {
    width: 36,
    textAlign: "center",
    color: "#9b9b9b",
    fontWeight: 600,
  },
  top1: {
    background:
      " linear-gradient(90deg, rgba(255, 187, 0, 0.18) 0%, rgba(228, 198, 27, 0.00) 100%)",
  },
  top2: {
    background:
      "linear-gradient(90deg, rgba(76, 146, 211, 0.18) 0%, rgba(76, 146, 211, 0.00) 100%)",
  },
  top3: {
    background:
      " linear-gradient(90deg, rgba(255, 147, 70, 0.18) 0%, rgba(255, 147, 70, 0.00) 100%)",
  },
}));

export default function RewardRankingPage() {
  const classes = useStyles();
  const navigate = useNavigate(); // react-router v6
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(0);
  const [countdown, setCountdown] = React.useState(36000); // seconds demo
  const labels = [t("rank.text7"), t("rank.text8"), t("rank.text9")]
  React.useEffect(() => {
    const t = setInterval(() => {
      setCountdown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const {
    rankData, // 完整的data对象
    rankList, // 列表数据（快捷访问）
    loading,
    error,
    pagination,
    changeRankType,
    loadMore,
    refetch,
    getRankTypeText
  } = useRankList("big", 1, 10);

  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
    changePoolType
  } = usePoolBalance(4);

  const handleTabChange = (tabIndex) => {
    setSelectedTab(tabIndex);
    // 根据tabIndex执行相应的逻辑
    // 根据Tab切换排行榜类型
    let rankType;
    switch (tabIndex) {
      case 0:
        rankType = "big";
        break;
      case 1:
        rankType = "new";
        break;
      case 2:
        rankType = "yongdong";
        break;
      default:
        rankType = "big";
    }
    changePoolType(tabIndex + 4)
    changeRankType(rankType);
  };

  const formatCountdown = () => {
    const now = new Date();
    const targetTime = new Date();

    // 设置目标时间为今天的22点
    targetTime.setHours(22, 0, 0, 0);

    // 如果当前时间已经超过今天的22点，目标时间设为明天的22点
    if (now >= targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    // 计算剩余毫秒数
    const diffInMs = targetTime - now;
    const diffInSeconds = Math.floor(diffInMs / 1000);

    // 正确计算小时、分钟、秒
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const sec = String(seconds).padStart(2, "0");

    return `${h}:${m}:${sec}`;
  };
  const goPage = () => {
    navigate(`/h5/asset?type=${selectedTab + 4}`)
  }


  return (
    <div className={classes.root}>
      {/* AppBar */}
      <AppBar position="static" sx={{
        background: "transparent",
        boxShadow: "none",
      }}>
        <Toolbar className={classes.toolbar}>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          {/* 占位保证标题居中 */}
          <IconButton
            style={{ color: "#333" }}
            onClick={() => {
              navigate("/h5/rankList");
            }}
          >
            <AssignmentIcon />
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
          {t("rank.text1")}
        </Typography>

        <img
          src={daoIcon}
          className={classes.daoAvatar}
          alt={t('loadError')}
          width={180}
          height={146}
          style={{
            position: "absolute",
            right: "0",
            top: "-21px",
          }}
        />
      </Box>

      <Box
        sx={{
          backdropFilter: "blur(14px)",
          bgcolor: "rgba(255, 255, 255, 0.50)",
          stroke: "#FFF",
          flexShrink: "0",
          strokeWidth: "1px",
          border: "1px solid rgba(255, 255, 255, 1)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          p: "12px",
        }}
      >
        {/* Tabs (pill) */}
        <RankingTabs onTabChange={handleTabChange} />

        <DataLoader
          loading={loading}
          error={error}
          onRetry={refetch}
          data={rankData}
          loadingText={t('loading')}
          errorText={t('loadError')}
        >
          {rankData => (
            <Box sx={{}}>          {/* Stat card */}
              <Box className={classes.statCardWrap}>
                <Box className={classes.statCard} elevation={0}>
                  <Box className={classes.statHeaderRow}>
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
                        {t("rank.text5")}
                      </Typography>
                    </Box>

                    <Box className={classes.countdown}>
                      <Typography variant="body2">{t("rank.text6")}</Typography>
                      <Typography variant="body2" style={{ fontWeight: 700 }}>
                        {formatCountdown(countdown)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      textAlign: "center",
                      bgcolor: "rgba(255, 255, 255, 0.40)",
                      borderRadius: "10px",
                      py: "16px",
                      mb: "20px"
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {labels[selectedTab] ?? labels[0]}
                    </Typography>
                    <Typography className={classes.percentBadge}>{balance?.f_percent+'%'}{t('rank.text10')}</Typography>
                    <Typography className={classes.bigNumber}>{rankData.pool_total
                    }</Typography>
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
                      {balance.account_balance + t("trump")}
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
                    {t('transferIn')}
                  </Button>
                  <Typography sx={{ textAlign: "center", color: "#999", fontSize: "13px", mt: "17px" }} onClick={goPage}>{t('transferOutList')}</Typography>
                </Box>
              </Box>

              {/* Ranking list */}
              <Box className={classes.rankList}>
                {rankData.list.length > 0 ?
                  (<List disablePadding>
                    {rankData.list.map((it, idx) => {
                      const medal =
                        idx === 0
                          ? first
                          : idx === 1
                            ? second
                            : idx === 2
                              ? three
                              : null;
                      return (
                        <ListItem
                          key={idx}
                          className={clsx({
                            [classes.top1]: idx === 0,
                            [classes.top2]: idx === 1,
                            [classes.top3]: idx === 2,
                          })}
                          sx={{
                            padding: "6px 12px",
                            borderRadius: '8px',
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-around",
                          }}
                        >
                          <div className={classes.rankIndex}>
                            {idx < 3 ? (
                              <img
                                src={medal}
                                alt=""
                                style={{ width: 28, height: 28 }}
                              />
                            ) : (
                              String(idx + 1).padStart(2, "0")
                            )}
                          </div>

                          <Typography
                            style={{
                              fontSize: "14px",
                              color: "#444",
                            }}
                          >
                            {it.user.mail}
                          </Typography>

                          <Typography
                            variant="caption"
                            style={{
                              color: "#9653FF",
                              fontSize: "14px",
                            }}
                          >
                            {it.amount}{t('trump')}
                          </Typography>

                          <Typography
                            style={{
                              fontSize: "14px",
                              color: "#95BE25",
                            }}
                          >
                            {it.percent}
                          </Typography>

                          {/* <ChevronRightIcon
                    style={{ marginLeft: 8, color: "#c7b9ff" }}
                  /> */}
                        </ListItem>
                      );
                    })}
                    {/* 👇 加载更多观察点 */}
                    {/* <LoadMore
                      loading={loading}
                      hasMore={pagination.hasMore}
                      onLoadMore={loadMore}
                    /> */}
                  </List>
                  ) : (<Box>{t('noData')}</Box>)}

              </Box>
            </Box>
          )}
        </DataLoader>
      </Box>
    </div>
  );
}
