import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Main () {

    const navigator = useNavigate()

    useEffect(() => {
        if(!localStorage.getItem('jwToken')){
            navigator('/login')
        }
    },[])
    return(
        <div>
            <h1>aaa</h1>
        </div>
    )
}