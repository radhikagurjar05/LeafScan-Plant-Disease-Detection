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

// Logout
export const logout = async () => {
  try {
    await API.post("/logout")
  } catch (err) {
    console.warn("Backend logout failed or offline:", err)
  } finally {
    localStorage.removeItem("user")
    localStorage.removeItem("name")
    window.dispatchEvent(new Event("authChange"))
  }
}