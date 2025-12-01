import React, { useState ,useEffect} from "react";
import RewardHeader from "../../components/RewardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import { useTranslation } from "react-i18next";
import { useNftList } from "../../hooks/useNftList";
import { DataLoader } from "../../components/DataLoader";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useWalletReady } from "../../utils/WalletReadyContext";
import { useUser } from "../../utils/UserContext";

export default function NftList() {
    const { t } = useTranslation();
    const [tab, setTab] = useState(0);
    const { isLoggedIn, userInfo } = useUser(); // 获取登录状态和用户信息
    const { walletReady } = useWalletReady();
    const {
        nftData,
        loading,
        error,
        pagination,
        loadMore,
        refetch,
        changeTransactionType
    } = useNftList(1, 10, 1);
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        changeTransactionType(newValue + 1)
    };

      // 🌟 关键：监听登录状态变化，重新请求数据
      useEffect(() => {
        console.log("登录状态变化", {
          isLoggedIn,
          hasUserInfo: !!userInfo,
          walletReady
        });
    
        if (isLoggedIn && userInfo) {
          console.log(" 用户已登录，重新请求数据");
          refetch();
        }
      }, [isLoggedIn, userInfo]);

    return (
        <Box sx={{ padding: "0 12px", width: "100%", boxSizing: "border-box" }}>
            <RewardHeader title={t("nft.text11")} />
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
                    label={t('nft.text12')}
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
                    label={t('nft.text13')}
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
                    // overflow: "auto",
                    "& ul": { padding: 0 },
                }}
            // subheader={<li />}
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
                            hash
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ flex: 1, textAlign: "center", fontWeight: "bold" }}
                        >
                            {t('nft.text13')}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ width: "100px", textAlign: "right", fontWeight: "bold" }}
                        >
                            {t('nft.text14')}
                        </Typography>
                    </Box>
                </ListSubheader>
                {/* 分组内容 */}
                <DataLoader
                    loading={loading}
                    error={error}
                    onRetry={refetch}
                    data={nftData}
                    loadingText={t('loading')}
                    errorText={t('loadError')}
                >
                    {nftData?.length > 0 ? (
                        nftData.map((item, itemIndex) => (
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
                                        {item.hash}
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
                        ))
                    ) : (<Box>{t("noData")}</Box>)}

                </DataLoader>
            </List>

        </Box>
    );
}
