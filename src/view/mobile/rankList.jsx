import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import RewardHeader from "../../components/RewardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useIncome } from "../../hooks/useIncome";
import { DataLoader } from "../../components/DataLoader";
import { useWithdraw } from "../../hooks/useWithdraw";
import ConfirmDialog from "../../components/ConfirmDialog";
export default function RankList() {
  const {t} = useTranslation()
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    incomeData,
    loading,
    error,
    refetch,
    loadMore,
    changeIncomeType
  } = useIncome(4, 1, 10)
  const { withdraw } = useWithdraw()
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    changeIncomeType(newValue + 4)
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirm = async () => {
    try {
      let type
      if (tab === 0) {
        type = 4
      } else if (tab === 1) {
        type = 5
      } else {
        type = 6
      }
      const res = await withdraw(type);
      console.log("成功提现:", res);

      handleCloseDialog();
      refetch(); // 刷新页面余额
    } catch (err) {
      console.error("提现失败:", err);
    }
  };
  return (
    <Box sx={{ padding: "0 12px", width: "100%", boxSizing: "border-box" }}>
      <RewardHeader title={t('nft.text11')} />
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          backgroundColor: "#F7F7FA",
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
          label={t('rank.text2')}
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
          label={t('rank.text3')}
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
          label={t('rank.text4')}
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
      <List
        sx={{
          width: "100%",
          position: "relative",
          overflow: "auto",
          "& ul": { padding: 0 },
        }}
        subheader={<li />}
      >
        {/* 固定表头 */}
        <ListSubheader
          sx={{
            background: "none",
            borderBottom: "1px solid #e0e0e0",
            zIndex: 2,
            position: "sticky",
            top: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: "12px",
              minHeight: "48px",
              py: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ width: "60px", fontWeight: "bold" }}
            >
              {t('rank.text11')}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ flex: 1, textAlign: "center", fontWeight: "bold" }}
            >
              {t('rank.text12')}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ width: "100px", textAlign: "right", fontWeight: "bold" }}
            >
              {t('rank.text13')}
            </Typography>
          </Box>
        </ListSubheader>

        {/* 分组内容 */}
        <DataLoader
          loading={loading}
          error={error}
          onRetry={refetch}
          data={incomeData}
          loadingText={t('loading')}
          errorText={t('loadError')}
        >
          {incomeData => (
            <li>
              <ul>
                {incomeData.map((item, itemIndex) => (
                  <ListItem key={`item-${itemIndex}`}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        px: "12px",
                        minHeight: "48px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: "60px", fontWeight: "bold" }}
                      >
                        {item.user_level}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#52c41a",
                        }}
                      >
                        {item.amount}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ width: "100px", textAlign: "right" }}
                        color="text.secondary"
                      >
                        {item.create_time}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </ul>
            </li>
          )}
        </DataLoader>

      </List>
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
      ></ConfirmDialog>
    </Box>
  );
}
