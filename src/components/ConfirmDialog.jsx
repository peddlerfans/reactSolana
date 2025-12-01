import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from "react-i18next";

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    content,
    confirmText,
    cancelText,
    loading = false,
    showIcon = true
}) => {

    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    padding: 1
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                {showIcon && (
                    <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
                        <CloseIcon
                            onClick={onClose}
                            sx={{
                                fontSize: 48,
                                color: 'warning.main'
                            }}
                        />
                    </Box>
                )}

                <img
                    src={require("../static/image/pages/transferOutIcon.png")}
                    alt=""
                    width={140}
                    height={140}
                />

                <Typography variant="h6" fontWeight="bold">
                    {t("confirmPopup.title")}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    {t("confirmPopup.content")}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ padding: 3, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    fullWidth
                    size="large"
                    sx={{
                        borderRadius: "30px",
                        bgcolor: "#EEEEF4",
                        border: "none",
                        color: "#333",
                        '&:hover': {
                            border: "none",
                            color: "#333",
                        }
                    }}
                >
                    {t("confirmPopup.cancel")}
                </Button>

                <Button
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                    fullWidth
                    size="large"
                    sx={{
                        borderRadius: "30px",
                        bgcolor: "#A069F6",
                        border: "none",
                        color: "#fff",
                        position: 'relative'
                    }}
                >
                    {loading && (
                        <CircularProgress
                            size={20}
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                marginLeft: '-10px'
                            }}
                        />
                    )}
                    <span style={{ opacity: loading ? 0 : 1 }}>
                        {t("confirmPopup.ok")}
                    </span>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
