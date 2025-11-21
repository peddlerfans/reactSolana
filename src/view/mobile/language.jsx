import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Avatar,
  Radio,
} from "@mui/material";
import i18n from "../../i18n"
import RewardHeader from "../../components/RewardHeader";
import cn from "../../static/image/pages/cn.png";
import en from "../../static/image/pages/en.png";
// import jp from "../../static/image/pages/jp.png";
// import th from "../../static/image/pages/th.png";
// import kr from "../../static/image/pages/kr.png";
import selectLanguage from "../../static/image/pages/selectLanguage.png";
const LanguageSwitch = () => {
  const [lang, setLang] = useState("zh");

  const languages = [
    { label: "中文", value: "zh", icon: cn },
    { label: "English", value: "en", icon: en },
    // { label: "Japanese", value: "ja", icon: jp },
    // { label: "แบบไทย", value: "th", icon: th },
    // { label: "한국인", value: "ko", icon: kr },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("i18nextLng");
    if (stored) setLang(stored);
    console.log(stored);
    
  }, []);

  const handleSelect = (value) => {
    setLang(value);
    localStorage.setItem("i18nextLng", value);
    // 如果你使用 react-i18next:
    i18n.changeLanguage(value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(180deg, #f4f7ff, #fefefe)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* 顶部导航 */}
      <RewardHeader title="切换语言" />
      {/* 内容区域 */}
      <Box
        sx={{
          marginTop: "20px",
          width: "88%",
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {languages.map((item, idx) => (
          <Card
            key={item.value}
            elevation={0}
            sx={{
              borderBottom:
                idx !== languages.length - 1 ? "1px solid #f3f3f3" : "none",
              borderRadius: 0,
            }}
          >
            <CardActionArea
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
              }}
              onClick={() => handleSelect(item.value)}
            >
              <img
                src={item.icon}
                alt={item.label}
                style={{
                  width: 40,
                  height: 40,
                  marginRight: "8px",
                }}
              />
              <Typography flex={1} fontSize={16}>
                {item.label}
              </Typography>
              <Box
                sx={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  border: "1px solid #D2D2D2",
                  backgroundImage:
                    lang === item.value ? `url(${selectLanguage})` : "none",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              ></Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default LanguageSwitch;
