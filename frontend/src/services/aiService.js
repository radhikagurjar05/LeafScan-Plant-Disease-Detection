import API from "./api"

export const askAI = async (question, disease = "") => {

  const res = await API.post("/ask-ai", {
    question,
    disease
  })

  return res.data.reply
}