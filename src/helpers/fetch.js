import Cookies from "js-cookie"

export const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:13131" : "https://miniera.tech:13131"
// export const apiUrl = "http://localhost:13131"

export const options = {
   mode: "cors",
   redentials: "include",
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
   },
}

const get = async (requestUrl, params = {}) => {
   requestUrl = apiUrl + requestUrl
   const authOptions = Cookies.get("my-session") ? { ...options, headers: { ...options.headers, Authorization: `Bearer ${Cookies.get("my-session")}` } } : options
   const esc = encodeURIComponent
   const queryParams = params
      ? `?${Object.keys(params)
           .map(k => `${esc(k)}=${esc(params[k])}`)
           .join("&")}`
      : ""
   return await fetch(`${requestUrl}${queryParams}`, { method: "GET", ...authOptions }).then(raw => raw.json())
}

const post = async (requestUrl, params = {}) => {
   requestUrl = apiUrl + requestUrl
   const authOptions = Cookies.get("my-session") ? { ...options, headers: { ...options.headers, Authorization: `Bearer ${Cookies.get("my-session")}` } } : options
   const body = JSON.stringify(params)
   return await fetch(requestUrl, { method: "POST", body, ...authOptions }).then(raw => raw.json())
}

const put = async (requestUrl, params = {}) => {
   requestUrl = apiUrl + requestUrl
   const authOptions = Cookies.get("my-session") ? { ...options, headers: { ...options.headers, Authorization: `Bearer ${Cookies.get("my-session")}` } } : options
   const body = JSON.stringify(params)
   return await fetch(requestUrl, { method: "PUT", body, ...authOptions }).then(raw => raw.json())
}

const del = async (requestUrl, params = {}) => {
   requestUrl = apiUrl + requestUrl
   const authOptions = Cookies.get("my-session") ? { ...options, headers: { ...options.headers, Authorization: `Bearer ${Cookies.get("my-session")}` } } : options
   const esc = encodeURIComponent
   const queryParams = params
      ? `?${Object.keys(params)
           .map(k => `${esc(k)}=${esc(params[k])}`)
           .join("&")}`
      : ""
   return await fetch(`${requestUrl}${queryParams}`, { method: "DELETE", ...authOptions }).then(raw => raw.json())
}

const def = { get, post, put, del }

export default def
