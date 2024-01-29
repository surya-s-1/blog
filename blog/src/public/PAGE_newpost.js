import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from "../components/COMPONENT_navbar"
import useAuth from '../functions/FUNCTION_auth'
import '../styles/newpost.css'

export default function NewPost() {
    useAuth()
    
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [message, setMessage] = useState(null)
    const username = localStorage.getItem('username')
    const navigate = useNavigate()

    // Pos the data to backend and if response is ok, naviate to that post else display error message
    const handleAddPost = async() => {
        const postData = {title: title, content: content, username: username}
        const response = await fetch('http://localhost:9000/api/blog/posts',{
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if (response.ok) {
            const post_id = data.post_id

            navigate(`/post/${post_id}`)
        } else {
            setMessage(data.message)
        }
    }

    return(
        <>
        <NavBar />
        <div className='container'>
            <h2>Write a New Post...</h2>
            <input type='text' placeholder='Title (250 char max)' value={title} onChange={(e)=>setTitle(e.target.value)} />
            <br />
            <textarea rows='10' cols='80' placeholder="Write more..." value={content} onChange={(e)=>setContent(e.target.value)} />
            <br />
            <button onClick={handleAddPost}>Add Post</button>
            <p>{message}</p>
        </div>
        </>
    )
}