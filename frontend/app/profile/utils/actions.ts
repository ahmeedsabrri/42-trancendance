import api from "@/app/auth/utils";

const handleRequest = async (username:string, type:string) => {
       const response = await api.get(`/users/request/${type}/${username}/`);
       console.log("not: ", response);
        return response;

}

export const UserFriendsActions = () => {
    return {
        handleRequest,
    };
}
