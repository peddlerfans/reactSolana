import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton
} from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
const PasswordDialog = ({
  open,
  onClose,
  onConfirm,
  onInputChange,
  password,
  iconImage,
  title = "输入密码",
  buttonText = "确定",
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
          textAlign: "center",
        },
      }}
    >
      {/* 标题 */}
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "#555" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ pb: 1, position: "relative" }}>
        <Box
          component="img"
          src={iconImage}
          alt="close"
          width={120}
          height={120}
          sx={{
            display: "block",
            mx: "auto",
            position: "relative",
          }}
        />
      </Box>
      {/* 密码输入框 */}
      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <TextField
          autoFocus
          fullWidth
          value={password}
          placeholder={inputPlaceholder}
          onChange={onInputChange}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "1.1rem",
              "&.Mui-focused fieldset": {
                borderColor: "#A069F6", // 聚焦时的边框颜色
              },
            },
            bgcolor: "#F5F5F9",
            border: "none",
          }}
        //   InputProps={{
        //     endAdornment: (
        //       <InputAdornment position="end">
        //         <IconButton onClick={handleClickShowPassword} edge="end">
        //           {showPassword ? <VisibilityOff /> : <Visibility />}
        //         </IconButton>
        //       </InputAdornment>
        //     ),
        //   }}
        />
      </DialogContent>

      {/* 确定按钮 */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          disabled={!password.trim()} // 密码为空时禁用
          size="large"
          sx={{
            py: 1,
            bgcolor: "#A069F6",
            borderRadius: "30px",
            border: "none",
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
