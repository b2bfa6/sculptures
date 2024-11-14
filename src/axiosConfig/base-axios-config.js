import axios from 'axios'


const http = axios.create({
    baseURL: "https://ulafonberber.com/api"
})

export default http;
