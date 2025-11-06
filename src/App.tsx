// src/App.tsx
import React, { FC, ReactNode, useMemo, useEffect, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider
} from "@solana/wallet-adapter-react-ui";

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

// 错误的写法：立即执行函数
// onClick={handleOpenDialog('outNtf')}   // ❌ 立即执行！
// onClick={handleOpenDialog('transferOut')} // ❌ 立即执行！

// // 正确的写法：传递函数引用
// onClick={() => handleOpenDialog('outNtf')}     // ✅
// onClick={() => handleOpenDialog('transferOut')} // ✅

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
  // 网络配置 注意目前是测试网,切换正式网Testnet换成Mainnet
  const network = WalletAdapterNetwork.Testnet;
  // 上线时需要改为：
  // const network = WalletAdapterNetwork.Mainnet; // 主网 - 真钱
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // 1. Solana官方免费节点（你正在用的）
  // const endpoint = "https://api.mainnet-beta.solana.com"; // 主网
  // const endpoint = "https://api.testnet.solana.com";     // 测试网

  // // 2. 第三方免费节点
  // const endpoint = "https://solana-mainnet.rpc.extrnode.com";

  // // 3. 付费专业节点（推荐用于生产环境）
  // const endpoint = "https://your-project.quiknode.pro/your-token/";
  // const endpoint = "https://solana-mainnet.helius-rpc.com/your-api-key/";
  //市场上各种可用钱包的列表
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network }),
      new SolflareWalletAdapter({ network }),
      new TrustWalletAdapter(),
      new ExodusWalletAdapter(),
      new MathWalletAdapter({ network }),
      new TokenPocketWalletAdapter({ network }),
      new LedgerWalletAdapter(),
      new MagicEdenWalletAdapter({ network }),
      new CoinhubWalletAdapter({ network }),
      new GlowWalletAdapter({ network }),
      new SolongWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}> {/* 提供网络连接  连接Solana区块链网络*/}
      <WalletProvider wallets={wallets} autoConnect> {/* 提供钱包管理  管理钱包连接状态*/}
        <WalletModalProvider>{/* 提供连接弹窗  显示"选择钱包"的弹窗*/}
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/* ----------------- Content: routing + header show logic ----------------- */
const Content: FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
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
  const [ address , setAddress ] = useState("")
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
          // 直接调用登录接口
          const loginResult = await apiService.user.login({
            mail: "0x95Cd4e05198A73E32453E65507e47fEc4b57f1f9",
            // 如果有签名需求，在这里添加
            // signature: await getSignature()
          });

          console.log('登录成功:', loginResult);

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
      {shouldShowHeader() ? <Header showWallet={true} address={address}/> : <div></div>}

      {/* 渲染路由 */}
      {ElementRouter}
    </div>
  );
};
