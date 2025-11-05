import { useState, useEffect } from "react";
import { apiService } from "../utils/apiService";
export const useGetMyTeam = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTeam = async () => {
    try {
       console.log("useMyTeam Hook执行了"); // 添加这行
      setLoading(true);
      setError(null);
      const res = await apiService.team.myTeam();
      setTeam(res.data);
      console.log(res);
      
    } catch (error) {
      setError(error.response?.data?.message || "获取用户信息失败");
      console.error("获取用户信息失败:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTeam();
  }, []);

  return {
    // 通用状态
    loading,
    error,
    team,
  };
};
