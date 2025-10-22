// config-overrides.js
// 稳健版：在不破坏 CRA 默认设置的前提下，注入 node polyfills 并把少数 node_modules 加入 babel 转译
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = function override(config, env) {
  // 1) 注入 Node polyfills（确保 path/os/stream/crypto 等可用）
  config.plugins = config.plugins || [];
  // 防止重复 push（如果多次运行）
  if (!config.plugins.find(p => p instanceof NodePolyfillPlugin)) {
    config.plugins.push(new NodePolyfillPlugin());
  }

  // 2) 找到 oneOf 和 babel-loader 规则（CRA 的标准结构）
  const oneOfRule = config.module && config.module.rules && config.module.rules.find(r => Array.isArray(r.oneOf));
  if (!oneOfRule) {
    // 如果找不到 structure，直接返回原 config（保持最小破坏）
    return config;
  }
  const oneOf = oneOfRule.oneOf;

  // 找到 babel-loader 那一项（兼容不同 CRA 版本的 loader 规则）
  const babelRuleIndex = oneOf.findIndex(rule => {
    return rule && rule.loader && typeof rule.loader === 'string' && rule.loader.includes('babel-loader');
  });

  if (babelRuleIndex !== -1) {
    const babelRule = oneOf[babelRuleIndex];

    // 保留原有 include（可能是 src 或数组），并在其上追加我们需要转译的 node_modules
    const extraIncludes = [
      path.resolve('node_modules/axios'),
      path.resolve('node_modules/@reown'),
      path.resolve('node_modules/@solana'),
      // 如果后续还有其它报错包，再把它们加到这里
    ];

    // 合成新的 include：保留原有 src/include，然后加上 extraIncludes（去重）
    const originalInclude = babelRule.include;
    const newIncludeSet = new Set();

    if (originalInclude) {
      if (Array.isArray(originalInclude)) {
        originalInclude.forEach(i => newIncludeSet.add(i));
      } else {
        newIncludeSet.add(originalInclude);
      }
    } else {
      // 如果没有原 include（极少见），把 src 目录加入
      newIncludeSet.add(path.resolve('src'));
    }

    extraIncludes.forEach(i => newIncludeSet.add(i));

    // 把 Set 转成 Array，赋回 babelRule.include
    babelRule.include = Array.from(newIncludeSet);

    // 确认我们没有无意间覆盖其他重要 loader 字段
    oneOf[babelRuleIndex] = babelRule;
  }

  // 3) 确保 fallback（path/os/stream/crypto）存在，避免某些包在编译时报错
  config.resolve = config.resolve || {};
  config.resolve.fallback = Object.assign({}, config.resolve.fallback || {}, {
    fs: false,
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
  });

  return config;
};
