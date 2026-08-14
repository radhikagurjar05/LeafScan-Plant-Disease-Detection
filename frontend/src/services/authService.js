import API from "./api"

// Signup
export const signup = async (data) => {
  const res = await API.post("/signup", data)
  return res.data
}

// Login
export const login = async (data) => {
  const res = await API.post("/login", data)
  return res.data
}