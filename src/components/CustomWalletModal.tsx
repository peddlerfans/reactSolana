// src/components/CustomWalletModal.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { toBase64 } from "../utils/encoding"; // 我会给一个简单的工具函数（见下）

interface Props {
    forceResetWallet?: () => void;
}

export default function CustomWalletModal({ forceResetWallet }: Props) {
    const { visible, setVisible } = useWalletModal() as any; // 依赖 WalletModalProvider
    const { wallets, select, connected, publicKey, wallet, signMessage } = useWallet();
    const { connection } = useConnection();
    const { t } = useTranslation()
    // local state for loading / error
    const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // cleanup errors whenever modal opens/closes
        if (!visible) {
            setError(null);
            setLoadingWallet(null);
        }
    }, [visible]);

    const handleSelect = async (adapterName: any) => {
        try {
            setLoadingWallet(adapterName);
            // 如果已经连接先断开 + 重置 provider（防止 adapter 缓存）
            if (connected && forceResetWallet) {
                // disconnect is handled by wallet provider when resetting, but call wallet?.adapter?.disconnect if available
                try { await (wallet?.adapter?.disconnect?.() as any); } catch (e) { }
                forceResetWallet();
            }
            // select will cause WalletProvider to attempt connecting
            select(adapterName);
            // close modal (WalletAdapter UI will manage connection flow)
            setVisible(false);
        } catch (err: any) {
            console.error("select wallet err", err);
            setError(String(err?.message || err));
        } finally {
            setLoadingWallet(null);
        }
    };

    // Example: sign nonce for login (we'll implement a dedicated function below)
    const handleSignForLogin = async () => {
        if (!publicKey) {
            setError("请先连接钱包");
            return;
        }
        try {
            // 获取后端的 nonce（示例 API）
            const res = await fetch("/api/auth/nonce", { method: "GET" });
            const { nonce } = await res.json();

            // 签名 - 检查是否有 signMessage
            if (!((wallet?.adapter as any)?.signMessage) && !signMessage) {
                setError("当前钱包不支持 signMessage，请使用支持的wallet或者使用 signTransaction ");
                return;
            }

            const message = new TextEncoder().encode(nonce);
            // some adapters expose signMessage on adapter or via useWallet().signMessage
            const signed = await (signMessage ? signMessage(message) : (wallet!.adapter as any).signMessage(message));
            // signed is a Uint8Array or object depends on adapter - normalize
            const signatureBase64 = toBase64(signed);
            // 把签名发送给后端验证登录
            const loginRes = await fetch("/api/auth/login-with-signature", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    publicKey: publicKey!.toString(),
                    signature: signatureBase64,
                }),
            });
            const loginJson = await loginRes.json();
            // 处理登录结果...
            console.log("login result", loginJson);
            // 关闭 modal
            setVisible(false);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || String(err));
        }
    };

    return (
        <Dialog open={visible} onClose={() => setVisible(false)} maxWidth="xs" fullWidth>
            <DialogTitle>
                {t("wallet.text1")}
                <IconButton
                    aria-label="close"
                    onClick={() => setVisible(false)}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {t("wallet.text2")}
                </Typography>

                <List>
                    {wallets.map((w) => {
                        const name = w.adapter.name;
                        // icon may be an URL or SVG string
                        const iconUrl = (w.adapter as any).icon || "";
                        return (
                            <Box key={name} mb={1}>
                                <ListItem
                                    secondaryAction={
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleSelect(name)}
                                            disabled={loadingWallet !== null}
                                        >
                                            {loadingWallet === name ? t("connecting") : t("wallet.text3")}
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={iconUrl as string}>{name?.[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={name} />
                                </ListItem>
                                <Divider />
                            </Box>
                        );
                    })}
                </List>

                {error && (
                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {/* 额外：演示签名登录按钮（可放在 profile / login 页面） */}
                {/* <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button variant="outlined" onClick={handleSignForLogin}>
                        用钱包签名登录（示例）
                    </Button>
                </Box> */}
            </DialogContent>
        </Dialog>
    );
}
