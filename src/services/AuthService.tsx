import api from "../api/api";

export const AuthService = {

    login(data: any) {
        return api.post("/login", data);
    },

    me() {
        return api.get("/me");
    },

    logout() {
        localStorage.removeItem("token");
    }

};