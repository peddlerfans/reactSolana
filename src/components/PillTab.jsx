import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Tabs, Tab, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import medal from "../static/image/pages/medal1.png";
import wingLeft from "../static/image/pages/wing-left.png";
import wingRight from "../static/image/pages/wing-right.png";
// 使用 styled 创建自定义组件
const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

const PillTab = styled(Tab)({
  position: "relative",
  borderRadius: "20px",
  minHeight: "40px",
  transition: "all 0.3s ease",
  zIndex: 1,
  fontSize: "15px",
  "&:not(.Mui-selected)": {
    backgroundColor: "transparent",
    color: "#888",
  },
  "&.Mui-selected": {
    backgroundImage: `url(${medal})`,
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    borderRadius: "0",
    color: "#9653FF",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "20px",
      height: "20px",
      backgroundImage: `url(${wingLeft})`,
      backgroundSize: "contain",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "20px",
      height: "20px",
      backgroundImage: `url(${wingRight})`,
      backgroundSize: "contain",
    },
  },
});

const RankingTabs = ({ onTabChange, initialTab = 0 }) => {
  const [tab, setTab] = useState(0);
  const { t } = useTranslation();
  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    // 调用父组件传递的回调函数
    if (onTabChange) {
      onTabChange(newValue);
    }
  };
  return (
    <Box sx={{ paddingBottom: "12px" }}>
      <CustomTabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
      >
        <PillTab label={t("rank.text2")} />
        <PillTab label={t("rank.text3")} />
        <PillTab label={t("rank.text4")} />
      </CustomTabs>
    </Box>
  );
};

export default RankingTabs;
