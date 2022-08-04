import axios from "axios"

const requestInstance = axios.create({
  baseURL: "/",
})

requestInstance.interceptors.response.use(
  (response) => {
    return response?.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default requestInstance
