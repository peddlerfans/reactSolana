import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Drawer,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bgi from '../static/image/menu/bgi.png'; // ✅ 背景图
import iconAsset from '../static/image/menu/asset.png';
import iconReward from '../static/image/menu/reward.png';
import iconNFT from '../static/image/menu/nft.png';
import iconRank from '../static/image/menu/rank.png';
import iconCommunity from '../static/image/menu/community.png';
import iconLanguage from '../static/image/menu/lang.png';
import iconAddress from '../static/image/menu/address.png';

const Header: React.FC<{ showWallet?: boolean }> = ({ showWallet = true }) => {
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
    const navigate = useNavigate();
    // 示例地址
    const address = "0xa8u921...5cs4";

    const menuItemsTop = [
        { text: "资产", icon: iconAsset, url: "/h5/asset" },
        { text: "社区奖励", icon: iconReward },
        { text: "NFT 委员会", icon: iconNFT },
        { text: "排行榜", icon: iconRank },
        { text: "我的社区", icon: iconCommunity },
    ];

    const menuItemsBottom = [
        { text: "切换语言", icon: iconLanguage },
        { text: "切换地址", icon: iconAddress },
    ];

    function navigatePage(data: any) {
        navigate(data.url)
    }

    const DrawerList = (
        <Box
            sx={{
                width: 280,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fff',
                backgroundImage: `url(${bgi})`,
                backgroundSize: "100% 135px",
                backgroundRepeat: "no-repeat",
            }}
            role="presentation"
        >
            {/* 顶部背景 + 账户信息 */}
            <Box
                sx={{

                    backgroundPosition: "top center",
                    p: 2,
                    pt: 2,
                    position: "relative",
                }}
            >
                <IconButton
                    onClick={toggleDrawer(false)}
                    sx={{ position: "absolute", top: 8, right: 8, color: "#555" }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography sx={{ fontSize: 14, color: "#666", mb: 0.5 }}>
                    我的账户
                </Typography>
                <Typography
                    sx={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#000",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "80%",
                    }}
                >
                    {address}
                </Typography>
            </Box>

            {/* 上半部分菜单 */}
            <List >
                {menuItemsTop.map((item, index) => (
                    <ListItemButton key={index} onClick={() => navigatePage(item)}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <img src={item.icon} alt="" width={22} height={22} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                        <ChevronRightIcon />
                    </ListItemButton>
                ))}
            </List>

            {/* 分割线 */}
            <Divider sx={{ mx: 2, my: 1.5 }} />

            {/* 下半部分菜单 */}
            <List>
                {menuItemsBottom.map((item, index) => (
                    <ListItemButton key={index}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <img src={item.icon} alt="" width={22} height={22} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                        <ChevronRightIcon />
                    </ListItemButton>
                ))}
            </List>

            {/* 底部退出登录 */}
            <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography sx={{ color: "#E84142", fontSize: 15, fontWeight: 500 }}>
                    退出登录
                </Typography>
            </Box>
        </Box>
    );

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton edge="start" aria-label="menu" sx={{ color: "white" }} onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                        {DrawerList}
                    </Drawer>
                </Box>

                <Box>
                    {showWallet ? <WalletMultiButton /> : null}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
