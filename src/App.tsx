// src/App.tsx
import React, { FC, ReactNode, useMemo, useEffect, useState, useCallback } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import CustomWalletModal from "./components/CustomWalletModal";
import {
  MagicEdenWalletAdapter,
  TokenPocketWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  CoinhubWalletAdapter,
  SolongWalletAdapter,
  ExodusWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { getWalletAuthData, validateWalletCapabilities } from './utils/walletAuth';
import { clusterApiUrl } from "@solana/web3.js";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import routes from "./route/routes";
import indexBgi from "./static/image/indexBg.png";
import commonBgi from "./static/image/pages/rankImg.png"
import Header from "./components/Header";
import { apiService } from "./utils/apiService";
import { SnackbarProvider } from './utils/SnackbarContext';
import { LoadingProvider } from "./utils/LoadingContext";
import { UserProvider } from './utils/UserContext';
import { useWalletReady, WalletReadyProvider } from "./utils/WalletReadyContext";
import { useUser } from "./utils/UserContext";
require("./App.css");
require("./style/font.css");
require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  return (
    <WalletReadyProvider>
      <LoadingProvider>
        <SnackbarProvider>
          <Context>
            <Content />
          </Context>
        </SnackbarProvider>
      </LoadingProvider>
    </WalletReadyProvider>
  );
};
export default App;

/* ----------------- Context: Connection + Wallet providers ----------------- */
const Context: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => {
    const allWallets = [
      new PhantomWalletAdapter(),
      new TrustWalletAdapter(),
      new ExodusWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new MagicEdenWalletAdapter(),
      new CoinhubWalletAdapter(),
      new GlowWalletAdapter(),
      new SolongWalletAdapter(),
    ];

    return allWallets.filter(w => {
      const state = w.readyState;
      return state === 'Installed' || state === 'Loadable';
    });
  }, []);

  const [walletState, setWalletState] = useState({
    resetKey: 0,
    lastConnectedWallet: localStorage.getItem('lastConnectedWallet')
  });

  const forceResetWallet = () => {
    localStorage.removeItem('lastConnectedWallet');
    localStorage.removeItem('walletName');
    setWalletState(prev => ({
      resetKey: prev.resetKey + 1,
      lastConnectedWallet: null
    }));
  };

  const WalletEventHandler: FC = () => {
    const { connected, wallet } = useWallet();
    // const { setWalletReady } = useWalletReady();

    // useEffect(() => {
    //   if (connected && wallet) {
    //     setWalletReady(true);
    //   } else {
    //     setWalletReady(false);
    //   }
    // }, [connected, wallet]);

    return null;
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        // key={walletState.resetKey}
        wallets={wallets}
        autoConnect={true}
      >
        <WalletModalProvider>
          {/* UserProvider 现在在 WalletProvider 内部 */}
          <UserProvider>
            <CustomWalletModal
              forceResetWallet={forceResetWallet}
            />
            <WalletEventHandler />
            {children}
          </UserProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/* ----------------- Content: routing + header show logic ----------------- */
const Content: FC = () => {
  const { connected, publicKey, disconnect, wallet } = useWallet();
  const ElementRouter = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();
  const [locationUrl, changeUrl] = useState(location.pathname);
  const [backgrounImg, setBackgrounImg] = useState("")
  const [backgroundColor, setBackgrounColor] = useState("")
  const [address, setAddress] = useState("")
  const { refreshUserInfo } = useUser();
  // 🌟 新增状态：跟踪上一次的连接状态
  const [lastConnected, setLastConnected] = useState(connected);
  const { setWalletReady } = useWalletReady(); // 引入 setWalletReady
  useEffect(() => {
    changeUrl(location.pathname);
  }, [location]);

  useEffect(() => {
    if (
      locationUrl === "/" ||
      locationUrl === "/h5/home" ||
      locationUrl === "/home"
    ) {
      setBackgrounImg(`url(${indexBgi})`)
      setBackgrounColor("none")
      navigate("/h5/home");
    } else if (locationUrl === "/h5/reward") {
      setBackgrounImg("none")
      setBackgrounColor("#F7F7FA")
    } else {
      setBackgrounImg(`url(${commonBgi})`)
      setBackgrounColor("#F7F7FA")
    }
  }, [locationUrl]);

  // 监听钱包连接状态，连接后自动登录
  useEffect(() => {
    const handleWalletLogin = async () => {
      if (connected && publicKey) {
        try {
          const walletAddress = publicKey.toString();
          console.log('钱包已连接，地址:', walletAddress);
          setAddress(walletAddress)

          const capabilities = validateWalletCapabilities(wallet);
          if (!capabilities.signMessage) {
            alert('当前钱包不支持消息签名，请使用支持的钱包如 Phantom');
            disconnect();
            return;
          }

          let authData;
          try {
            authData = await getWalletAuthData(
              publicKey,
              (wallet?.adapter as any)?.signMessage?.bind(wallet?.adapter),
              wallet?.adapter.name || 'unknown'
            );
            console.log('钱包授权信息获取成功:', authData);
          } catch (authError) {
            console.error('获取授权信息失败:', authError);
            alert('请授权签名以完成登录');
            disconnect();
            return;
          }

          const loginResult = await apiService.user.login({
            mail: walletAddress,
            signature: authData.signature,
            message: authData.message,
            publicKey: authData.publicKey
          });

          if (loginResult.data?.token) {
            localStorage.setItem('token', loginResult.data.token);
            console.log('Token已保存');
            // 🌟 关键：手动触发 UserContext 刷新用户信息
            refreshUserInfo();
            // 登录成功后，设置 WalletReady 为 true
            setWalletReady(true);
          }

        } catch (error) {
          console.error('登录失败:', error);
          disconnect();
        }
      } else if (lastConnected === true && connected === false) {
        // --- 逻辑 2: 主动断开连接 (从 true 变为 false) ---
        // 只有当状态从连接变为断开时才清除 Token
        localStorage.removeItem('token');
        setWalletReady(false);
        console.log('钱包已断开，Token已清除');
      }
      // 更新上一次的连接状态
      setLastConnected(connected);
    };

    handleWalletLogin();
  }, [connected, publicKey, disconnect]);

  const shouldShowHeader = () => {
    return (
      locationUrl === "/" ||
      locationUrl === "/home" ||
      locationUrl === "/h5/home" ||
      locationUrl === "/trialtest01"
    );
  };

  return (
    <div className="App"
      style={{
        backgroundImage: backgrounImg,
        backgroundColor: backgroundColor,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {shouldShowHeader() ? <Header showWallet={true} address={address} /> : <div></div>}
      {ElementRouter}
    </div>
  );
};