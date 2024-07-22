import {jwtDecode} from 'jwt-decode';

export const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const getDecodedToken = () => {
    const token = getToken();
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // console.log("decoded token:", decodedToken); 
            return decodedToken;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }
    return null;
};
