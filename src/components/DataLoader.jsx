// components/DataLoader.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';
// eslint-disable-next-line react-hooks/rules-of-hooks

/**
 * 数据加载组件 - 安全版本
 */
export const DataLoader = ({
  loading,
  error,
  data,
  children,
  loadingText,
  errorText,
  minHeight = 200,
  onRetry
}) => {
  const {t} = useTranslation()
  // 加载状态
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight,
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography color="text.secondary">{t("loading")}</Typography>
      </Box>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button
                color="inherit"
                size="small"
                onClick={onRetry}
              >
                {t('retry')}
              </Button>
            )
          }
        >
          {t("loadError")}: {error}
        </Alert>
      </Box>
    );
  }

  // 正常状态
  try {
    if (typeof children === 'function') {
      const result = children(data);
      if (Array.isArray(result)) return <>{result}</>;
      return React.isValidElement(result) ? result : null;
    } else {
      return <>{children}</>;
    }
  } catch (err) {
    console.error('DataLoader渲染错误:', err);
    // 延迟跳转到根路由，给用户短暂提示时间
    // setTimeout(() => window.location.replace('/'), 1000);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t('elementError')}
        </Alert>
      </Box>
    );
  }
};