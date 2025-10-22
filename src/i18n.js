// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

// 引入语言包（可以单独放在 ./locales/en.json, zh.json）
const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

i18n
  .use(LanguageDetector) // 自动检测语言
  .use(initReactI18next) // 让 react-i18next 生效
  .init({
    resources,
    fallbackLng: "en", // 默认语言
    debug: false,
    interpolation: {
      escapeValue: false, // React 已经有 XSS 保护
    },
  });

export default i18n;
