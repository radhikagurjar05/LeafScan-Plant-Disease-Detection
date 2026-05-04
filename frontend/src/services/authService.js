import API from "./api"

// Signup
export const signup = async (data) => {
  const res = await API.post("/signup", data)
  return res.data
}

// Login
export const login = async (data) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};