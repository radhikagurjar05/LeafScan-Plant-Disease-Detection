import API from "./api"

export const predictDisease = async (file) => {

  const formData = new FormData()
  formData.append("file", file)

  const res = await API.post("/predict", formData)

  return res.data
}