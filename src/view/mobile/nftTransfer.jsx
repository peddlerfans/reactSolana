import React, { useState } from "react";
import RewardHeader from "../../components/RewardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import { useNftList } from "../../hooks/useNftList";
import { DataLoader } from "../../components/DataLoader";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
export default function NftList() {
    const [tab, setTab] = useState(0);
    const groupedData = [
        {
            date: "2024/01/15",
            items: [
                { rank: 1, dividend: "+120.50" },
                { rank: 2, dividend: "+98.75" },
                { rank: 3, dividend: "+76.30" },
            ],
        },
        {
            date: "2024/01/14",
            items: [
                { rank: 4, dividend: "+65.20" },
                { rank: 5, dividend: "+54.80" },
                { rank: 6, dividend: "+43.90" },
            ],
        },
        {
            date: "2024/01/13",
            items: [
                { rank: 7, dividend: "+32.60" },
                { rank: 8, dividend: "+21.40" },
            ],
        },
    ];
    const {
        nftData,
        loading,
        error,
        pagination,
        loadMore,
        refetch,
        changeTransactionType
    } = useNftList(1, 10, 1);
    console.log(nftData);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        changeTransactionType(newValue + 1)
    };
    return (
        <Box sx={{ padding: "0 12px", width: "100%", boxSizing: "border-box" }}>
            <RewardHeader title="我的记录" />
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
                    label="转入记录"
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
                    label="转出记录"
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
                            金额
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{ width: "100px", textAlign: "right", fontWeight: "bold" }}
                        >
                            日期
                        </Typography>
                    </Box>
                </ListSubheader>
                {/* 分组内容 */}
                <DataLoader
                    loading={loading}
                    error={error}
                    onRetry={refetch}
                    data={nftData}
                    loadingText={`加载中...`}
                    errorText={`加载失败`}
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
                    ) : (<Box>暂无数据</Box>)}

                </DataLoader>
            </List>
        </Box>
    );
}
