import api from "@/app/auth/utils";

const handleRequest = async (username:string, type:string) => {
    const response = await api.get(`/users/request/${type}/${username}/`);
    return response;
}

export const UserFriendsActions = () => {
    return {
        handleRequest,
    };
}
