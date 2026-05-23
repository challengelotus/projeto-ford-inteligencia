import axios from 'axios';

const API_URL = 'http://localhost:8000';

const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams();
        params.append("username", credentials.email);
        params.append("password", credentials.password);

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        console.log(error.response.data);
        throw error;
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        throw error;
    }
};

export { loginUser, fetchUserProfile };