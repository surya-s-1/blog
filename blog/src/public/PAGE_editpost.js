import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/COMPONENT_navbar";
import useAuth from "../functions/FUNCTION_auth";
import '../styles/postdetails.css'

var host = process.env.REACT_APP_API_ENDPOINT

export default function EditPost() {
    useAuth()
    
    const post_id = useParams().post_id
    const currentuser = localStorage.getItem('username')

    const [post, setPost] = useState(null)
    const [message, setMessage] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        // fetch post and comments for that post seperately
        const fetchPost = async () => {
            try {
                const postResponse = await fetch(`${host}/posts/${post_id}`)
                const postData = await postResponse.json()

                setPost(postData)
            } catch (err) {
                console.error('Error fetching post: ', err)
            }
        }

        fetchPost()
    }, [post_id, currentuser])

    const handleSaveEdit = async () => {
        const response_update = await fetch(`${host}/posts/${post_id}`, {
            method: 'PUT',
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response_update.ok) {
            navigate(`/post/${post_id}`)
        } else {
            const data = await response_update.json()

            setMessage(data.message)
        }
    }

    return(
        <div>
            <NavBar />
            {post ? (
                <div className="container">
                    <input 
                        value={post.title}
                        onChange={e => setPost({...post, title: e.target.value})}
                    />
                    <br />
                    <textarea 
                        value={post.content}
                        onChange={e => setPost({...post, content: e.target.value})}
                    />
                    <br />
                    <button onClick={handleSaveEdit}>Save</button>
                    <p>{message}</p>
                </div>
            ) : (
                <div>
                    Post unavailable
                </div>
            )}
        </div>
    )
}