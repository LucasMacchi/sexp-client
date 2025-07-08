import axios from "axios";
const SERVER = import.meta.env.VITE_SERVER;

export default async function (email: string): Promise<boolean> {
    try {
        const token: string = (await axios.post(SERVER + "/user/login", { email: email })).data;
        localStorage.setItem("jwToken", token);
        return true
    } catch (error) {
        alert("Error a iniciar sesion.");
        return false
    }
}