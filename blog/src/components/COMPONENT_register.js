import {useState} from "react";

var host = `http://localhost:9000/api`

export default function Register() {
    const [message, setMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const formData = {
        username: username,
        password: password,
        email: email
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            // Post the username and password to backend
            const response = await fetch(`${host}/blog/register`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type' : 'application/json' }
            })

            //Sets the response message whether registration was successful or not
            const data = await response.json()
            setMessage(data.message)
        } catch (err) {
            console.error('Registration failed: ', err)
        }
    }

    return (
        <div className="reg">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" placeholder="Username" value={formData.username} onChange={e=>setUsername(e.target.value)} required/>
                </label>
                <br />
                <label>
                    <input type="password" placeholder="Password" value={formData.password} onChange={e=>setPassword(e.target.value)} required/>
                </label>
                <br />
                <label>
                    <input type="email" placeholder="Email" value={formData.email} onChange={e=>setEmail(e.target.value)} required/>
                </label>
                <br />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    )
}