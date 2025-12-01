// src/hooks/useAuthorizedFetch.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * 通用授权数据请求 Hook
 * @param {Function} fetcher - 实际执行 API 请求的异步函数，例如：(params) => apiService.get(...)
 * @param {Array} dependencies - fetcher 函数的额外依赖项 (除了 connected 和 token)
 * @param {boolean} shouldFetchOnConnect - 默认为 true，指示在连接成功后是否自动触发请求
 * @returns {object} { data, loading, error, refetch }
 */
export const useAuthorizedFetch = (fetcher, dependencies = [], shouldFetchOnConnect = true) => {
    const { connected } = useWallet();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // 用于防止内存泄漏的 ref (如前所述)
    const mountedRef = useRef(true);
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const fetchData = useCallback(async (...params) => {
        // 1. 检查组件是否已卸载
        if (!mountedRef.current) return;
        
        // 2. 检查连接和授权（Token）
        const currentToken = localStorage.getItem('token');
        if (!connected || !currentToken) {
            setData(null); // 清空数据
            console.log("useAuthorizedFetch: 跳过请求，未连接或Token缺失。");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // 3. 执行传入的实际请求函数
            const result = await fetcher(...params);
            
            if (mountedRef.current) {
                setData(result);
            }
        } catch (err) {
            if (mountedRef.current) {
                setError(err);
                console.error("授权请求失败:", err);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [connected, fetcher, ...dependencies]); // 依赖项：connected, fetcher 函数引用，以及额外的 deps

    // 自动触发请求的 useEffect
    useEffect(() => {
        if (shouldFetchOnConnect) {
            // 只要连接成功且 Token 存在，就尝试请求
            const currentToken = localStorage.getItem('token');
            if (connected && currentToken) {
                console.log("useAuthorizedFetch: 侦测到连接和Token，自动触发请求。");
                fetchData();
            } else if (!connected) {
                 setData(null); // 断开连接时清空数据
            }
        }
    }, [connected, fetchData, shouldFetchOnConnect]);

    return {
        data,
        loading,
        error,
        refetch: fetchData, // 返回封装了授权检查的 refetch
    };
};