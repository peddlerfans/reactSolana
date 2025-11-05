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
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BottomDialog from "../../components/BottomDialog";
import { makeStyles } from "@material-ui/core/styles";
import daoIcon from "../../static/image/pages/daoIcon.png";
import { useCurrentDate } from "../../hooks/data";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("")
  const [tab, setTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };
  const handleOpenDialog = useCallback((str) => {
    if (str === 'transferIn') {
      setTitle("转入NFT");
    } else if (str === 'outNft') {
      setTitle("转出NFT");
    } else {
      setTitle("转出收益");
    }
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
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

  const leftData = [
    {
      id: 1,
      name: "名称名称名称名称",
      address: "GjWWGhX...Rh9d5y3Wstvn58",
      date: "2026/06/06 11:11"
    },
    {
      id: 2,
      name: "名称名称名称名称",
      address: "GjWWGhX...Rh9d5y3Wstvn58",
      date: "2026/06/06 11:11"
    },
    {
      id: 3,
      name: "名称名称名称名称",
      address: "GjWWGhX...Rh9d5y3Wstvn58",
      date: "2026/06/06 11:11"
    },
    {
      id: 4,
      name: "名称名称名称名称",
      address: "GjWWGhX...Rh9d5y3Wstvn58",
      date: "2026/06/06 11:11"
    }
  ]
  const rightData = [
    { id: 1, title: "NFT加权分红", percentage: "5%", amount: "+120川普币", date: "2026/06/06" },
    { id: 2, title: "NFT加权分红", percentage: "5%", amount: "+120川普币", date: "2026/06/06" },
    { id: 3, title: "NFT加权分红", percentage: "5%", amount: "+120川普币", date: "2026/06/06" },
    { id: 4, title: "NFT加权分红", percentage: "5%", amount: "+120川普币", date: "2026/06/06" },
    { id: 5, title: "NFT加权分红", percentage: "5%", amount: "+120川普币", date: "2026/06/06" },
    { id: 6, title: "NFT加权分红", percentage: "5%", amount: "+120川普币", date: "2026/06/06" },
  ]
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
          {t("nft.text1")}
        </Typography>

        <img
          src={daoIcon}
          alt="加载失败"
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

      {/* Stat card */}
      <Box
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
            大单奖金池(川普币)
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
            50%分红
          </Typography>
          <Typography
            sx={{
              color: "#333",
              fontSize: "36px",
              fontWeight: "600",
            }}
          >
            233,565.00
          </Typography>
        </Box>
        <Button
          onClick={() => handleOpenDialog('transferIn')}
          variant="contained"
          sx={{
            width: "100%",
            mt: "20px",
            bgcolor: "#A069F6",
            color: "#FFF",
            fontWeight: "bold",
            borderRadius: "30px",
            boxShadow: "none",
            mb: "11px"
          }}
        >
          转入
        </Button>
        <Box
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
            转出NFT
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
            转出收益
          </Button>
        </Box>
      </Box>

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
          label="我的NFT"
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
          label="DAO联盟治理委员会"
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
              {leftData.map((item, index) => (
                <ListItem
                  key={item.id}
                  sx={{
                    bgcolor: "#FFF",
                    borderRadius: "12px",
                    display: "block",
                    p: "16px",
                    mb: index === leftData.length - 1
                      ? 0 : "12px"
                  }}
                >
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
                    {item.name}
                  </Typography>

                  {/* 地址 */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "14px",
                      color: "#666",
                      mb: 1,
                      fontFamily: "'Monospace', 'Courier New', monospace"
                    }}
                  >
                    {item.address}
                  </Typography>

                  {/* 日期 */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      color: "#999"
                    }}
                  >
                    {item.date}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {tab === 1 && (
          <Paper sx={{ borderRadius: 2, boxShadow: "none", p: 2, backgroundColor: "#F1EFF9" }}>
            <List sx={{ py: 0 }}>
              {rightData.map((item, index) => (
                <ListItem key={item.id} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderRadius: '12px',
                  p: '16px',
                  alignItems: 'center', bgcolor: '#fff',
                  mb: index === rightData.length - 1
                    ? 0 : "12px"
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                    <img src={require("../../static/image/pages/nftIcon.png")} alt="" width={20} height={20} />
                    <Box sx={{ ml: "10px" }}>
                      <Typography sx={{ fontSize: '14px', color: '#333' }} >{item.title}</Typography>
                      <Typography sx={{
                        width: '40px',
                        height: '20px',
                        color: '#A069F6',
                        borderRadius: '4px',
                        fontSize: '13px',
                        bgcolor: 'rgba(160, 105, 246, 0.15)',
                        lineHeight: '20px', textAlign: 'center'
                      }}>{item.percentage}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    <Typography sx={{ fontSize: '15px', color: '#9ACD12' }}>{item.amount}</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#999' }}>{item.date}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <BottomDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={title}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
        inputPlaceholder={t("inputNum")}
      />
    </Box>
  );
}
