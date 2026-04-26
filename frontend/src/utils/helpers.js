// Format confidence (0.91 → 91.00%)
export const formatConfidence = (value) => {
  if (!value) return "0%"
  return (value * 100).toFixed(2) + "%"
}


// Format date (timestamp → readable)
export const formatDate = (dateString) => {
  if (!dateString) return ""

  const date = new Date(dateString)

  return date.toLocaleString()
}


// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return ""

  return text.charAt(0).toUpperCase() + text.slice(1)
}


// Shorten long text
export const shortenText = (text, length = 100) => {
  if (!text) return ""

  return text.length > length
    ? text.substring(0, length) + "..."
    : text
}


// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}


// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9)
}