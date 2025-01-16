import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

const handleRequest = async (username:string, type:string) => {
       const response = await api.get(`/users/request/${type}/${username}/`);
        return response;

}

export const UserFriendsActions = () => {
    return {
        handleRequest,
    };
}
