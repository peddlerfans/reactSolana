// components/LoadMore.jsx
import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";

const LoadMore = ({ loading, hasMore, onLoadMore }) => {
    const loadMoreRef = useRef(null);
    const hasTriggered = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting) {
                    // 避免重复触发
                    if (!hasTriggered.current && !loading && hasMore) {
                        hasTriggered.current = true; // 标记触发过
                        onLoadMore();
                    }
                } else {
                    // 元素离开视口后重置标记
                    hasTriggered.current = false;
                }
            },
            { root: null, rootMargin: "0px", threshold: 0.1 }
        );

        const target = loadMoreRef.current;
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [loading, hasMore, onLoadMore]);


    return (
        <div
            ref={loadMoreRef}
            style={{
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {loading && hasMore && (
                <Typography variant="body2" color="textSecondary">
                    加载中...
                </Typography>
            )}
            {!hasMore && (
                <Typography variant="body2" color="textSecondary">
                    已加载完全部数据
                </Typography>
            )}
        </div>
    );
};

export default LoadMore;
