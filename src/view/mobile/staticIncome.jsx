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
import daoIcon from "../../static/image/pages/staticIcon.png";
import { useCurrentDate } from "../../hooks/data";
import { usePoolBalance } from "../../hooks/usePoolBalance";
import { useIncome } from "../../hooks/useIncome";
import { DataLoader } from "../../components/DataLoader";
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
  const { t } = useTranslation();
  const currentDate = useCurrentDate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("")
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

  const goPage =()=>{
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
          静态分红池
        </Typography>

        <img
          src={daoIcon}
          alt="加载失败"
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
              您的贡献值：
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "14px", color: "#333" }}>
              {balance.person_contribution_value + t("trump")}
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
              全网个人贡献值总和：
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
              可提现奖励：
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
              剩余奖励额度：
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
            转出
          </Button>
        </Box>)}
      </DataLoader>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "28px", mx: "12px" }}>
        <Typography sx={{ color: "#333", fontSize: "17px" }}>收益明细</Typography>
        <Typography sx={{ color: "#888", fontSize: "13px" }} onClick={goPage}>{"转出记录>"}</Typography>
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
                      静态分红
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
