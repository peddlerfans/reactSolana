// src/App.tsx
import React, { FC, ReactNode, useMemo, useEffect, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
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

import Header from "./components/Header"; // <-- 你的 Header 组件（我之前给的）
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
  // 网络配置
  const network = WalletAdapterNetwork.Testnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

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
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

/* ----------------- Content: routing + header show logic ----------------- */
const Content: FC = () => {
  // platform check (mobile vs desktop)
  const plat = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );

  // useRoutes from your route file
  const ElementRouter = useRoutes(routes);

  const location = useLocation();
  const navigate = useNavigate();
  const [locationUrl, changeUrl] = useState(location.pathname);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 保持只在首次 mount 时执行（与你原逻辑一致）

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
    <div className="App">
      {/* 如果你想 header 在所有页面显示，把 shouldShowHeader() 改为 true */}
      {shouldShowHeader() ? <Header showWallet={true} /> : <div></div>}

      {/* 渲染路由 */}
      {ElementRouter}
    </div>
  );
};
