import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useTranslation } from 'react-i18next';
import { apiService } from "../../utils/apiService";
import { useState, useEffect } from 'react';
// import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import PasswordDialog from '../../components/PasswordDialog';
import { Box, Typography, Divider, Button, DialogActions, TextField } from '@mui/material';
import { useSnackbar } from "../../utils/SnackbarContext";
import { useLoading } from "../../utils/LoadingContext";
import { useSolanaTransfer } from "../../hooks/useSolanaTransfer";
import { useTransfer } from "../../hooks/useTransfer";
import { useUser } from '../../utils/UserContext';
import inviteImage from "../../static/image/fiting/inviteImg.png"
require("./home.css");

const TodoList = () => {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { userInfo, isLoggedIn, refreshUserInfo } = useUser();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("")
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { signSingleTransfer, isSigning } = useSolanaTransfer();
  const { transfer } = useTransfer()
  const { showSnackbar } = useSnackbar()
  const { showLoading, hideLoading } = useLoading()
  let wallet = useAnchorWallet();

  // 点击绑定邀请人确定
  const handlePasswordConfirm = async () => {
    try {
      const res: any = await apiService.user.bindInvate({ invite_code: inviteCode })
      if (res.msg === "success") {
        refreshUserInfo()
        setInviteOpen(false)
        showSnackbar(t("inviteSuccess"), "success")
      } else {
        showSnackbar(t(`${res.code}`), "error")
      }
    } catch (error) {
      console.log(error);
    }
    console.log('输入的邀请码:', inviteCode);
    setInviteCode("")
  }

  const handleClosePasswordDialog = () => {
    setInviteOpen(false)
  }

  const handlePwdInputChange = (event: any) => {
    setInviteCode(event.target.value);
  };


  const handleTransfer = async () => {
    if (!connected || !publicKey) {
      showSnackbar(t("assets.text31"), "error")
      return;
    }

    if (!inputValue || Number(inputValue) <= 0) {
      showSnackbar(t("assets.text32"), "error")
      return;
    }

    if (userInfo.pledge_amount >= Number(inputValue)) {
      showSnackbar(t("error.text13", { value: userInfo.pledge_amount }) || "必须输入10的倍数", "error");
      return;
    }

    if (Number(inputValue) % 10 !== 0) {
      showSnackbar(t("assets.text20") || "必须输入10的倍数", "error");
      return;
    } else if (!userInfo?.invite_user_id && isLoggedIn) {
      console.log(userInfo?.invite_user_id);

      showSnackbar(t("inviter"), "error")
      setInviteOpen(true)
      return
    }
    setLoading(true);
    showLoading(t('hooks.text3'));
    try {
      console.log("开始分发交易...");
      const transactionData = await transfer(inputValue, publicKey.toString())
      console.log(transactionData);

      let res = await signSingleTransfer(transactionData?.data.transactions[0]);
      console.log(res);

      const transferStatus: any = await apiService.user.setPledge({ amount: inputValue, signature: res })
      if (transferStatus.code === 200) {
        showSnackbar(t("sign.text9"), "success");
      } else {
        showSnackbar(t(`${transferStatus.code}`), "error");
      }
      hideLoading()
    } catch (error: any) {
      // showSnackbar(error, 'error')
      console.error('完整的错误信息:', error);
    } finally {
      hideLoading()
      setLoading(false);
    }
  };
  /**useEffect替代生命周期函数componentDidMount和componentDidUpdate */
  useEffect(() => {
    // getUser()
  }, [wallet, connected])

  // 处理输入框变化
  const handleInputChange = (event: any) => {
    const value = event.target.value;

    // 只允许输入数字
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
      // 实时验证
      validateInput(value);
    }
  };

  // 验证输入
  const validateInput = (value: string) => {
    if (!value) {
      setError("");
      return;
    }
    const numValue = parseInt(value);
    if (numValue < 10) {
      setError(t("assets.text19") || "最小数量为10");
    } else if (numValue % 10 !== 0) {
      setError(t("assets.text20") || "必须输入10的倍数");
    } else {
      setError("");
    }
  };

  // 失去焦点时验证
  const handleBlur = () => {
    validateInput(inputValue);
  };

  // 按钮点击开始输入
  const handleButtonClick = () => {
    setIsEditing(true);
    setInputValue("");
    setError("");
  };


  return (
    <div className="content">
      {/* 标题和标语 */}
      <Box sx={{ textAlign: 'center', mb: 3, marginTop: "400px", padding: "0 28px" }}>
        <Typography
          // onClick={getData}
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: '#FFF',
            mb: "20px",
            fontSize: "32px"
          }}
        >
          Fighting DAO
        </Typography>

        <Typography
          color={"rgba(255, 255, 255, 0.60)"}
          variant="h6"
          sx={{
            lineHeight: 1.6,
            mb: "40px",
            fontSize: "14px",
          }}
        >
          {t("welcome")}
        </Typography>

        {/* 分割线 */}
        <Divider sx={{ my: 3 }} />
      </Box>

      {/* 选择贡献数量标题 */}
      {!isEditing ? (
        // 初始状态 - 按钮
        <Button
          variant="outlined"
          fullWidth
          onClick={handleButtonClick}
          sx={{
            py: 1,
            bgcolor: "#A069F6",
            borderRadius: "30px",
            border: "none",
            color: "#fff",
            height: "50px",
            fontSize: "16px",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#8a5cf0",
              border: "none"
            }
          }}
        >
          {t("chooseNum")}
        </Button>
      ) : (
        // 编辑状态 - 输入框
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={t("assets.text17") || "请输入贡献数量..."}
            type="text"
            inputMode="numeric"
            fullWidth
            error={!!error}
            helperText={error || (t("assets.text18") || "提示: 最小10，且为10的倍数")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                height: "50px",
                backgroundColor: "transparent",

                // 默认状态边框
                "& fieldset": {
                  border: "2px solid #8a5cf0",
                  borderRadius: "30px",
                },

                // 悬停状态边框
                "&:hover fieldset": {
                  border: "2px solid #A069F6",
                },

                // 聚焦状态边框
                "&.Mui-focused fieldset": {
                  border: "2px solid #A069F6",
                  boxShadow: "0 0 0 2px rgba(160, 105, 246, 0.1)"
                },

                // 错误状态边框
                "&.Mui-error fieldset": {
                  border: "2px solid #ff4d4f",
                }
              },

              "& .MuiOutlinedInput-input": {
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#fff",
                padding: "12px 20px",
                height: "26px"
              },

              "& .MuiFormHelperText-root": {
                textAlign: "center",
                marginTop: "4px",
                fontSize: "12px",
                marginLeft: "0",
                marginRight: "0",
                color: "#fff",
              }
            }}
          />
        </Box>
      )}


      {/* 贡献方式选择 */}
      <DialogActions sx={{ p: 2, gap: 1, padding: "24px 0 0 0 " }}>
        <Button
          onClick={handleTransfer}
          variant="outlined"
          fullWidth
          sx={{
            py: 1,
            bgcolor: "#CFF174",
            borderRadius: "30px",
            border: "none",
            color: "#333",
            height: "50px"
          }}
        >
          {t("walletTransIn")}
        </Button>
      </DialogActions>

      <PasswordDialog
        password={inviteCode}
        open={inviteOpen}
        onClose={handleClosePasswordDialog}
        onConfirm={handlePasswordConfirm}
        title={t("bindInviter")}
        buttonText={t("confirm")}
        inputPlaceholder={t("inputInviteCode")}
        onInputChange={handlePwdInputChange}
        iconImage={inviteImage}
      />
    </div>
  );
}

export default TodoList;