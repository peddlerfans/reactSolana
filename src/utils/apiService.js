// services/apiService.js
import axios from "./api";

export const apiService = {
  // NFT相关接口
  nft: {
    getList: (data) => axios.post("/api/account/myNftList", data),
    nftIncome: (data) => axios.post("/api/account/incomeList", data), //奖励记录
  },

  // 用户相关接口
  user: {
    login: (data) => axios.post("/api/user/login", data),
    bindInvate: (data) => axios.post("/api/user/bindInvite", data),
    getProfile: () => axios.post("/api/account/accountInfo"),
    transferIn: (data) => axios.post("/api/account/pledgeList", data),
    transferOut: (data) => axios.post("/api/account/withDrawList", data),
  },
  team: {
    myTeam: () => axios.post("/api/user/myTeam"),
  },
  rank: {
    bigRankList: (data) => axios.post("/api/account/ranList", data),
    yongdongRankList: (data) =>
      axios.post("/api/account/yongdongRanList", data),
    newRankList: (data) => axios.post("/api/account/newUserRanList", data),
  },
  reward: {
    teamUser: (data) => axios.post("/api/user/teamUser", data),
    teamLevel: (data) => axios.post("/api/user/teamLevel", data),
  },
  // 收益相关接口，查询奖池金额
  earnings: {
    searchReward: (data) => axios.post("/api/account/poolAmount", data), //查询奖池金额
  },
  //可提现余额
  balance: {
    withdraw: (data) => axios.post("/api/account/tokenAccount", data),
  },
  //奖励记录
  rewardList: {
    income: (data) => axios.post("/api/account/incomeList", data),
  },
  //提现记录
  withDraw: {
    getList: (data) => axios.post("/api/account/withDrawList", data),
  },
};
