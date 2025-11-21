// components/LoadMore.jsx
import React, { useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
const LoadMore = ({ loading, hasMore, onLoadMore }) => {
    const {t} =useTranslation()
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
                    {t('loading')}
                </Typography>
            )}
            {!hasMore && (
                <Typography variant="body2" color="textSecondary">
                    {t('loadFinish')}
                </Typography>
            )}
        </div>
    );
};

export default LoadMore;
