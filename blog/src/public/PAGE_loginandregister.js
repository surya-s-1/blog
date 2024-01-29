import Login from "../components/COMPONENT_login";
import Register from "../components/COMPONENT_register";
import '../styles/login.css'

export default function LoginAndRegister() {
    return(
        <>
        <h1>Blog</h1>
        <div className="logAndReg">
            <Login />
            <Register />
        </div>
        </>
    )
}