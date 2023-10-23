import axios from "axios";
import { baseURL } from "./api";
import Cookie from 'cookie-universal'
const cookie = Cookie()
const token = cookie.get("user-token")

export const AX = axios.create({
    baseURL:baseURL,
    headers:{
        Authorization:`Bearer ${token}`
    }
})