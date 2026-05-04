import axios from "axios"

const API = "http://127.0.0.1:5000"

export const uploadVideo = async (file: File) => {

  const formData = new FormData()
  formData.append("file", file)

  const res = await axios.post(API + "/upload", formData)

  return res.data
}