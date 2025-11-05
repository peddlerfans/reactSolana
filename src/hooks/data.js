import React from "react";

// 自定义Hook - 通常以use开头命名
export function useCurrentDate() {
  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  };

  return getFormattedDate(); // 直接返回值
}
