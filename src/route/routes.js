//路由表配置：src/routes/index.jsx
import { Navigate } from 'react-router-dom';

import Home from '../view/home/home';
import Document from '../view/Document/Document';
import A from '../view/withDraw/withDraw';
import MobileHome from '../view/mobile/home';
import MobileDocument from '../view/mobile/document';
import MobileAssetPage from '../view/mobile/assetPage'


const router = [
  // Navigate 重定向
	{ path: '/', element: <Navigate to='/home' /> },
	{ path: '/home', element: <Home /> },
	{ path: '/Document', element: <Document /> },
	{ path: '/trialtest01', element: <A /> },
	{ path: "/h5/home", element: <MobileHome /> },
	{ path: "/h5/document", element: <MobileDocument /> },
	{ path: "/h5/asset", element: <MobileAssetPage /> }
];

export default router;
