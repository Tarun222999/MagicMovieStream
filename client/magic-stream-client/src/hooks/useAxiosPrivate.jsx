import axios from "axios"
//import useAuth from "./useAuth"
const apiUrl = import.meta.env.VITE_API_BASE_URL
const useAxiosPrivate = () => {

    const axiosAuth = axios.create({
        baseURL: apiUrl,
        withCredentials: true
    })

    //  const { auth } = useAuth()

    // axiosAuth.interceptors.request.use((config) => {
    //     console.log(auth)
    //     if (auth) {
    //         config.headers.Authorization = `Bearer ${auth.token}`
    //     }

    //     return config
    // })

    return axiosAuth

}

export default useAxiosPrivate