//Axios HTTP Client με αυτόματο JWT Injection
//https://axios-http.com/docs/interceptors
//https://stackoverflow.com/questions/69871670/axois-react-keycloak-web-token-in-inteceptor ************

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {keycloak} from '@/utils/keycloak';

// Base URL από .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE;

// Δημιουργία axios instance
const apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds. Να μη λήξει αν αργήσει το OCR!
});

//ΠΡΙΝ ΑΠΟ ΚΑΘΕ REQUEST
apiService.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            await keycloak.updateToken(30); //Αν λήξει το token σε 30'' να ανανεωθεί
        } catch (error) {
            console.error('Failed to refresh token', error);
            await keycloak.login(); // Αν το refresh απέτυχε redirect σε login
            return Promise.reject(error);
        }

        //Προσθήκη Authorization Header
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        //logging για debugging
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

//ΜΕΤΑ ΑΠΟ ΚΑΘΕ RESPONSE
apiService.interceptors.response.use(
    (response) => {
        //success response
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
    },
    async (error: AxiosError) => {
        //error response-αναλογα με το error

        //401 Unauthorized
        if (error.response?.status === 401) {
            console.error('[API 401] Unauthorized - redirecting to login');
            keycloak.login();
            return Promise.reject(error);
        }

        //403 Forbidden
        if (error.response?.status === 403) {
            console.error('[API 403] Forbidden - insufficient permissions');
            // Μπορείς να redirect σε /unauthorized page
        }

        //500 Server Error
        if (error.response?.status === 500) {
            console.error('[API 500] Server Error', error.response.data);
        }

        //error logging γενικο
        console.error('[API Error]', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
        });

        return Promise.reject(error);
    }
);

export default apiService;