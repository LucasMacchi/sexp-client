import { jwtDecode } from "jwt-decode";
import { IUser } from "./interface";
import tokenExpireCheck from "./tokenExpireCheck";

export default function () {
    const token = localStorage.getItem("jwToken");
    if(token) {
        if(tokenExpireCheck()) window.location.href = "/login"
        const data: IUser = jwtDecode(token);
        console.log(data)
        if(data.admin) localStorage.setItem('admin',data.email)
        if(window.location.pathname === "/login"){
            window.location.href = "/"
        }
        return data
    }
    else{
        console.log("NO LOG")
        window.location.href = "/login"
    }
}