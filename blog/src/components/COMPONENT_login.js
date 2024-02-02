import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import '../styles/login.css'

var host = `http://localhost:9000/api`

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const formData = {username: username, password: password}

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Post the username and password to backend
            const response = await fetch(`${host}/blog/login`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type' : 'application/json' }
            })

            // If the post was not successful, it sets the response message
            if (!response.ok) {
                const data = await response.json()
                setMessage(data.message)
            } else {
                // If the post was successful then it takes the jwt token and decodes it and stores it in local storage and navigates to home page
                var data = await response.json()
                const token = data.token
                
                const decodedToken = jwtDecode(token)
                localStorage.setItem('token',token)
                localStorage.setItem('username',decodedToken.username)

                navigate('/home')
            }
        } catch (err) {
            console.error('Login failed: ', err)
        }
    }

    return (
        <div className="log">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" placeholder="Username" value={formData.username} onChange={e=>setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    <input type="password" placeholder="Password" value={formData.password} onChange={e=>setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    )
}