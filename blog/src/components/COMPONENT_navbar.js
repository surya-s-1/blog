import { NavLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import '../styles/navbar.css'

export default function NavBar() {
    const navigate = useNavigate()
    
    // On clicking logout button handleLogout is executed which first removes token and username from local storage and navigates to login page
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        navigate('/')
    }
    
    return(
        <div className='navbar'>
            <h2>Blog</h2>
            <NavLink className='navcomp' to="/home">Home</NavLink>
            <NavLink className='navcomp' to="/myposts">My Posts</NavLink>
            <NavLink className='navcomp' to="/newpost">Create Post</NavLink>
            <button className='navcomp' onClick={handleLogout}>Logout</button>
        </div>
    )
}