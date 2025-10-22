// BottomDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

require("./bottomDialog.css");
const BottomDialog = ({
  open,
  onClose,
  title = "标题",
  inputValue,
  onInputChange,
  onConfirm,
  onCancel,
  confirmText = "确定",
  cancelText = "取消",
  inputLabel = "请输入内容",
  inputPlaceholder = "请输入...",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          width: "100%",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          m: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "unset",
          background: "linear-gradient(0deg, #FFF 71.03%, #E1D9FF 100%)",
        },
      }}
    >
      {/* 顶部区域 */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          position: "relative",
          padding: "15px 12px 20px 12px",
        }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{
            position: "relative",
            display: "inline-block",
            color: "#333",
            "font-family": "YouSheBiaoTiHei",
            "font-size": "26px",
            "font-style": "normal",
            "font-weight": 400,
            "line-height": "normal",
            "&::after": {
              content: '""',
              position: "absolute",
              left: 0,
              bottom: "0", // 标题文字与线条的间距，可根据视觉微调
              "z-index": "-1",
              width: "100%",
              height: "9px",
              borderRadius: "4.5px",
              background:
                "linear-gradient(90deg, #A069F6 0%, rgba(160, 105, 246, 0.00) 100%)",
            },
          }}
        >
          {title}
        </Typography>
        {/* <IconButton onClick={onClose} size="small"> */}
        {/* 这里可以替换为你的图片 */}
        {/* <ImageIcon /> */}
        {/* 或者使用 img 标签 */}
        <img
          className="daoImg"
          src={require("../static/image/fiting/daoImg.png")}
          alt="close"
          width={120}
          height={120}
        />
        {/* </IconButton> */}
      </DialogTitle>

      {/* 中间输入框区域 */}
      <DialogContent sx={{ pt: 1, padding: "0 12px 20px 12px" }}>
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.60)",
            "box-shadow": "0 4px 20px 0 rgba(157, 136, 190, 0.15)",
            "backdrop-filter": "blur(10px)",
            padding: "40px 16px",
            borderRadius: "20px",
          }}
        >
          <TextField
            fullWidth
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={onInputChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "1.1rem",
                "&.Mui-focused fieldset": {
                  borderColor: "#A069F6", // 聚焦时的边框颜色
                },
              },
              mt: 1,
              borderRadius: "8px",
              bgcolor: "#F5F5F9",
              border: "none",
            }}
          />
          <DialogActions sx={{ p: 2, gap: 1, padding: "24px 0 0 0 " }}>
            <Button
              onClick={onCancel}
              variant="outlined"
              fullWidth
              sx={{
                py: 1,
                bgcolor: "#EEEEF4",
                borderRadius: "30px",
                border: "none",
                color: "#333",
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              fullWidth
              sx={{
                py: 1,
                bgcolor: "#A069F6",
                borderRadius: "30px",
                border: "none",
              }}
            >
              {confirmText}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BottomDialog;
