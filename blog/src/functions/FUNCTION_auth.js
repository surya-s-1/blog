import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// This function is run upon opening any page in the blog to check if token is present or not and if it's present, is it valid or expired
const useAuth = () => {
    const navigate = useNavigate()
    
    useEffect(()=>{
        const token = localStorage.getItem('token')

        // If token is not present, navigates to login page
        if (!token) {
            navigate('/')
        } else {
            // If token is present, decodes the token and checks the expiration time
            try {
                const decodedToken = jwtDecode(token)
                // convert seconds to milliseconds
                const expirationTime = decodedToken.exp * 1000
    
                if (Date.now() > expirationTime) {
                    // If expires, remove token and username from local storage and navigate to login page
                    localStorage.removeItem('token')
                    localStorage.removeItem('username')
                    navigate('/')
                }
            } catch (err) {
                console.error(err)
            }
        }
    }, [navigate])

    return
}

export default useAuth