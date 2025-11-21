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
  SolflareWalletAdapter,
  CoinhubWalletAdapter,
  SolongWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  ExodusWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { getWalletAuthData, validateWalletCapabilities } from './utils/walletAuth';
import { clusterApiUrl } from "@solana/web3.js";
import { useRoutes, useLocation, useNavigate } from "react-router-dom";
import routes from "./route/routes";
import indexBgi from "./static/image/indexBg.png";
import commonBgi from "./static/image/pages/rankImg.png"
import Header from "./components/Header"; // <-- 你的 Header 组件（我之前给的）
import { apiService } from "./utils/apiService";
/* keep original requires to preserve css/font */
require("./App.css");
require("./style/font.css");
require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};

export default App;

/* ----------------- Context: Connection + Wallet providers ----------------- */
const Context: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SolflareWalletAdapter(),
      new TrustWalletAdapter(),
      new ExodusWalletAdapter(),
      // new MathWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new MagicEdenWalletAdapter(),
      new CoinhubWalletAdapter(),
      new GlowWalletAdapter(),
      new SolongWalletAdapter(),
    ],
    [] // 移除 network 依赖，避免不必要的重渲染
  );

  // 钱包状态管理
  const [walletState, setWalletState] = useState({
    resetKey: 0,
    lastConnectedWallet: localStorage.getItem('lastConnectedWallet')
  });

  const forceResetWallet = () => {
    // 清除本地存储的钱包信息
    localStorage.removeItem('lastConnectedWallet');
    localStorage.removeItem('walletName');

    setWalletState(prev => ({
      resetKey: prev.resetKey + 1,
      lastConnectedWallet: null
    }));
  };

  // WalletEventHandler runs inside the WalletProvider to observe connect/disconnect/error
  const WalletEventHandler: FC = () => {
    const { connected, publicKey, wallet } = useWallet();

    useEffect(() => {
      if (connected && wallet) {
        const walletName = (wallet as any)?.adapter?.name || (wallet as any)?.name;
        console.log('钱包连接成功:', walletName);
        if (walletName) {
          localStorage.setItem('lastConnectedWallet', walletName);
        }
      } else {
        console.log('钱包已断开');
        localStorage.removeItem('lastConnectedWallet');
        localStorage.removeItem('walletName');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected, publicKey, wallet]);

    useEffect(() => {
      const adapter = (wallet as any)?.adapter;
      if (!adapter || typeof adapter.on !== 'function') return;
      const onError = (err: any) => {
        console.error('钱包错误:', err);
        setTimeout(() => {
          localStorage.removeItem('lastConnectedWallet');
          localStorage.removeItem('walletName');
        }, 1000);
      };
      adapter.on('error', onError);
      return () => {
        adapter.off && adapter.off('error', onError);
      };
    }, [wallet]);

    return null;
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        key={walletState.resetKey}
        wallets={wallets}
        autoConnect={false}
      >
        <WalletModalProvider>
          <CustomWalletModal
            forceResetWallet={forceResetWallet}
          />
          <WalletEventHandler />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/* ----------------- Content: routing + header show logic ----------------- */
const Content: FC = () => {
  const { connected, publicKey, disconnect, wallet } = useWallet();
  // platform check (mobile vs desktop)
  const plat = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );

  // useRoutes from your route file
  const ElementRouter = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();
  const [locationUrl, changeUrl] = useState(location.pathname);
  const [backgrounImg, setBackgrounImg] = useState("")
  const [backgroundColor, setBackgrounColor] = useState("")
  const [address, setAddress] = useState("")
  useEffect(() => {
    // update on route change
    changeUrl(location.pathname);
  }, [location]);

  useEffect(() => {
    // initial route redirect logic (keeps your original behavior)
    if (
      locationUrl === "/" ||
      locationUrl === "/h5/home" ||
      locationUrl === "/home"
    ) {
      setBackgrounImg(`url(${indexBgi})`)
      setBackgrounColor("none")
      if (plat) {
        if (document.location.search !== "") {
          navigate("/h5/home" + document.location.search);
        } else {
          navigate("/h5/home");
        }
      } else {
        if (document.location.search !== "") {
          navigate("/home" + document.location.search);
        } else {
          navigate("/home");
        }
      }
    } else if (locationUrl === "/Document" || locationUrl === "/h5/document") {
      if (plat) {
        navigate("/h5/document");
      } else {
        navigate("/Document");
      }
    } else if (locationUrl === "/h5/reward") {
      setBackgrounImg("none")
      setBackgrounColor("#F7F7FA")
    } else {
      setBackgrounImg(`url(${commonBgi})`)
      setBackgrounColor("#F7F7FA")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationUrl]); // 保持只在首次 mount 时执行（与你原逻辑一致）

  // 监听钱包连接状态，连接后自动登录
  useEffect(() => {
    const handleWalletLogin = async () => {

      if (connected && publicKey) {
        try {
          const walletAddress = publicKey.toString();
          console.log('钱包已连接，地址:', walletAddress);
          setAddress(walletAddress)


          // 验证钱包能力
          const capabilities = validateWalletCapabilities(wallet);
          if (!capabilities.signMessage) {
            alert('当前钱包不支持消息签名，请使用支持的钱包如 Phantom');
            disconnect();
            return;
          }

          // 获取完整的钱包授权信息
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

          // 直接调用登录接口
          const loginResult = await apiService.user.login({
            mail: walletAddress,
            // mail: "0x95Cd4e05198A73E32453E65507e47fEc4b57f1f9",
            // 如果有签名需求，在这里添加
            signature: authData.signature,
            message: authData.message,
            publicKey: authData.publicKey
          });

          // 保存token到localStorage
          if (loginResult.data?.token) {
            localStorage.setItem('token', loginResult.data.token);
            console.log('Token已保存');
          }

        } catch (error) {
          console.error('登录失败:', error);
          // 登录失败可以断开钱包连接
          disconnect();
        }
      } else if (!connected) {
        // 钱包断开时清除token
        localStorage.removeItem('token');
        console.log('钱包已断开，Token已清除');
      }
    };

    handleWalletLogin();
  }, [connected, publicKey, disconnect]);

  // 控制哪些路径显示 header（保留你原来那段判断）
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
      {/* 如果你想 header 在所有页面显示，把 shouldShowHeader() 改为 true */}
      {shouldShowHeader() ? <Header showWallet={true} address={address} /> : <div></div>}

      {/* 渲染路由 */}
      {ElementRouter}
    </div>
  );
};
