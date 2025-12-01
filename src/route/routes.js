//路由表配置：src/routes/index.jsx
import { Navigate } from "react-router-dom";

import Home from "../view/home/home";
import Document from "../view/Document/Document";
import A from "../view/withDraw/withDraw";
import MobileHome from "../view/mobile/home";
import MobileDocument from "../view/mobile/document";
import MobileAssetPage from "../view/mobile/assetPage";
import MobileRankPage from "../view/mobile/rankPage";
import MobileRankList from "../view/mobile/rankList";
import MobileCommunity from "../view/mobile/community";
import MobileReward from "../view/mobile/reward";
import MobileNftPage from "../view/mobile/nftPage";
import MobileLanguage from "../view/mobile/language";
import MobileStaticIncome from "../view/mobile/staticIncome";
import MobileNftTransfer from "../view/mobile/nftTransfer";
import MobileAirdrop from "../view/mobile/airDropPage";
const router = [
  // Navigate 重定向
  { path: "/", element: <Navigate to="/home" /> },
  { path: "/home", element: <Home /> },
  { path: "/Document", element: <Document /> },
  { path: "/trialtest01", element: <A /> },
  { path: "/h5/home", element: <MobileHome /> },
  { path: "/h5/document", element: <MobileDocument /> },
  { path: "/h5/asset", element: <MobileAssetPage /> },
  { path: "/h5/rank", element: <MobileRankPage /> },
  { path: "/h5/rankList", element: <MobileRankList /> },
  { path: "/h5/community", element: <MobileCommunity /> },
  { path: "/h5/reward", element: <MobileReward /> },
  { path: "/h5/nftPage", element: <MobileNftPage /> },
  { path: "/h5/language", element: <MobileLanguage /> },
  { path: "/h5/staticIncome", element: <MobileStaticIncome /> },
  { path: "/h5/nftTransfer", element: <MobileNftTransfer/> },
  { path:"/h5/airdrop", element: <MobileAirdrop/>}
];

export default router;
