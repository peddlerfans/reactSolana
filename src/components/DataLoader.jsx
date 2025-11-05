// components/DataLoader.jsx
import React from 'react';
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material';

/**
 * 数据加载组件 - 安全版本
 */
export const DataLoader = ({ 
  loading, 
  error, 
  data,
  children, 
  loadingText = '加载中...',
  errorText = '加载失败',
  minHeight = 200,
  onRetry
}) => {
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
        <Typography color="text.secondary">{loadingText}</Typography>
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
                重试
              </Button>
            )
          }
        >
          {errorText}: {error}
        </Alert>
      </Box>
    );
  }

  // 正常状态
  try {
    if (typeof children === 'function') {
      const result = children(data);
      return React.isValidElement(result) ? result : null;
    } else {
      return React.isValidElement(children) ? children : null;
    }
  } catch (err) {
    console.error('DataLoader渲染错误:', err);
    // 延迟跳转到根路由，给用户短暂提示时间
    setTimeout(() => window.location.replace('/'), 1000);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          组件渲染错误，正在跳转到首页...
        </Alert>
      </Box>
    );
  }
};