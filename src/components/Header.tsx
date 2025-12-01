import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bgi from '../static/image/menu/bgi.png'; // ✅ 背景图
import iconAsset from '../static/image/menu/asset.png';
import iconReward from '../static/image/menu/reward.png';
import iconNFT from '../static/image/menu/nft.png';
import iconRank from '../static/image/menu/rank.png';
import iconAirdrop from '../static/image/menu/airdrop.png';
import iconCommunity from '../static/image/menu/community.png';
import iconLanguage from '../static/image/menu/lang.png';
import iconAddress from '../static/image/menu/address.png';
import iconStatic from '../static/image/menu/static.png';
import { useSnackbar } from "../utils/SnackbarContext";
const Header: React.FC<{ showWallet?: boolean, address?: string }> = ({ showWallet = true, address }) => {
    const [open, setOpen] = React.useState(false);
    const { showSnackbar } = useSnackbar();
    const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const menuItemsTop = [
        { text: t("drawer.text2"), icon: iconAsset, url: "/h5/asset" },
        { text: t("drawer.text3"), icon: iconReward, url: "/h5/reward" },
        { text: t("drawer.text4"), icon: iconNFT, url: "/h5/nftPage" },
        { text: t("drawer.text5"), icon: iconRank, url: "/h5/rank" },
        { text: t("drawer.text10"), icon: iconAirdrop, url: "/h5/airdrop" },
        { text: t("drawer.text6"), icon: iconCommunity, url: "/h5/community" },
        { text: t("drawer.text9"), icon: iconStatic, url: "/h5/staticIncome" },
    ];

    const menuItemsBottom = [
        { text: t("drawer.text7"), icon: iconLanguage, url: "/h5/language" },
        // { text: "切换地址", icon: iconAddress },
    ];

    function navigatePage(data: any) {
        if (localStorage.getItem("token")) {
            navigate(data.url)
        } else {
            showSnackbar(t("sign.text1"), "error")
        }
    }
    // 定义所有需要国际化的标签
    const labels = {
        // 连接状态标签
        'connecting': t('wallet.connecting') || 'Connecting',
        'connected': t('wallet.connected') || 'Connected',
        'disconnecting': t('wallet.disconnecting') || 'Disconnecting',
        'has-wallet': t('wallet.hasWallet') || 'Connect',
        'no-wallet': t('wallet.noWallet') || 'Select Wallet',

        // 下拉菜单标签
        'copy-address': t('wallet.copyAddress') || 'Copy address',
        'copied': t('wallet.copied') || 'Copied',
        'change-wallet': t('wallet.changeWallet') || 'Change wallet',
        'disconnect': t('wallet.disconnect') || 'Disconnect'
    };

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
                    {t("drawer.text1")}
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
                    <ListItemButton key={index} onClick={() => navigatePage(item)}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <img src={item.icon} alt="" width={22} height={22} />
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                        <ChevronRightIcon />
                    </ListItemButton>
                ))}
            </List>

            {/* 底部退出登录 */}
            {/* <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography sx={{ color: "#E84142", fontSize: 15, fontWeight: 500 }}>
                    退出登录
                </Typography>
            </Box> */}
        </Box>
    );

    return (
        <AppBar position="fixed" color="transparent" elevation={0} sx={{
            zIndex: 9995,     // 让你的 header 永远在最上层
            pointerEvents: "auto !important",
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, md: 4 }, pointerEvents: "auto" }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton edge="start" aria-label="menu" sx={{
                        color: "white", zIndex: 9996,
                        pointerEvents: "auto !important",
                    }} onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}
                        sx={{
                            zIndex: 9999,
                            pointerEvents: "auto",
                        }}
                    >
                        {DrawerList}
                    </Drawer>
                </Box>

                <Box>
                    {showWallet ? <BaseWalletMultiButton
                        labels={labels}
                    /> : null}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
