// RewardRankingPage.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import clsx from "clsx";
import { useNavigate } from "react-router-dom"; // react-router v6
import RankingTabs from "../../components/PillTab";
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

  // AppBar
  appBar: {
    background: "transparent",
    boxShadow: "none",
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
    paddingBottom: "35px",
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

  // Ranking list
  rankList: {
    marginTop: "14px",
    borderRadius: 12,
  },
  rankItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background .15s",
    "&:hover": {
      background: "#faf6ff",
    },
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

// helper to shorten address
function shortAddress(addr = "", start = 6, end = 4) {
  if (!addr) return "";
  if (addr.length <= start + end) return addr;
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

const sampleData = Array.from({ length: 10 }).map((_, i) => ({
  addr: `0xsdsasdasdasdasdas${i}658`,
  amount: 168,
  percent: "45%",
}));

export default function RewardRankingPage() {
  const classes = useStyles();
  const navigate = useNavigate(); // react-router v6

  const [tab, setTab] = React.useState(0);
  const [countdown, setCountdown] = React.useState(36000); // seconds demo

  React.useEffect(() => {
    const t = setInterval(() => {
      setCountdown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formatCountdown = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className={classes.root}>
      {/* AppBar */}
      <AppBar position="static" className={classes.appBar}>
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
          全站排行榜
        </Typography>

        <img
          src={daoIcon}
          className={classes.daoAvatar}
          alt="加载失败"
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
        <RankingTabs />

        {/* Stat card */}
        <Box className={classes.statCardWrap}>
          <Paper className={classes.statCard} elevation={0}>
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
                  今日分红
                </Typography>
              </Box>

              <Box className={classes.countdown}>
                <Typography variant="body2">倒计时：</Typography>
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
              }}
            >
              <Typography variant="body2" color="textSecondary">
                大单奖金池(川普币)
              </Typography>
              <Typography className={classes.percentBadge}>50%分红</Typography>
              <div className={classes.bigNumber}>233,565.00</div>
            </Box>
          </Paper>
        </Box>

        {/* Ranking list */}
        <Box className={classes.rankList}>
          <List disablePadding>
            {sampleData.map((it, idx) => {
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
                  className={clsx(classes.rankItem, {
                    [classes.top1]: idx === 0,
                    [classes.top2]: idx === 1,
                    [classes.top3]: idx === 2,
                  })}
                  onClick={() => {
                    // 点击行可跳到详情页或其他
                    // navigate(`/rank/${idx}`);
                    console.log("click", idx);
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
                    {shortAddress(it.addr)}
                  </Typography>

                  <Typography
                    variant="caption"
                    style={{
                      color: "#9653FF",
                      fontSize: "14px",
                    }}
                  >
                    {it.amount} 川普币
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
          </List>
        </Box>
      </Box>
    </div>
  );
}
