import API from "./api"

export const getHistory = async () => {
  const res = await API.get("/history")
  return res.data.history
}