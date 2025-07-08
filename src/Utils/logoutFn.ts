
export default async function () {
    localStorage.removeItem("jwToken")
    localStorage.removeItem("admin")
    window.location.href = "/login"
}