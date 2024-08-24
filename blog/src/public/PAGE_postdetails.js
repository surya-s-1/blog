import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/COMPONENT_navbar";
import useAuth from "../functions/FUNCTION_auth";
import '../styles/postdetails.css'

var host = process.env.REACT_APP_API_ENDPOINT

export default function PostDetails() {
    useAuth()
    
    const post_id = useParams().post_id
    const currentuser = localStorage.getItem('username')

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [message, setMessage] = useState(null)
    const [showDelete, setShowDelete] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        const fetchPost = async () => {
            try {
                const postResponse = await fetch(`${host}/posts/${post_id}`)
                const postData = await postResponse.json()

                const commentResponse = await fetch(`${host}/comments/post/${post_id}`)
                const commentData = await commentResponse.json()

                setPost(postData)
                setComments(commentData)

                if (postData.username === currentuser) {
                    setShowDelete(true)
                }
            } catch (err) {
                console.error('Error fetching post: ', err)
            }
        }

        fetchPost()
    },[post_id, currentuser])

    const handleAddComment = async() => {
        const commentData = { post_id: post_id, username: currentuser, comment: newComment}

        const response_post = await fetch(`${host}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
            headers: { 'Content-Type' : 'application/json' }
        })

        var data_post = await response_post.json()
        setMessage(data_post.message)
        
        const response_get = await fetch(`${host}/comments/post/${post_id}`)
        var data_get = await response_get.json()
        setComments(data_get)
        setNewComment('')
    }

    const handleDeletePost = async () => {
        const response_delete = await fetch(`${host}/posts/${post_id}`, {
            method: 'DELETE'
        })

        if (response_delete.ok) {
            navigate(`/myposts`)
        }
    }

    const handleEditPost = () => {
        navigate(`/post/${post_id}/edit`)
    }

    return(
        <div>
            <NavBar />
            {post ? (
                <div className="container">
                    <div className="title-delete">
                        <h2>{post.title}</h2>
                        {showDelete && 
                        <span>
                            <button onClick={handleEditPost}>Edit</button>
                            <button onClick={handleDeletePost}>Delete</button>    
                        </span>}
                    </div>
                    <p>{post.content}</p>
                    <p className="username"><i>by <b>{post.username}</b></i></p>

                    <h3>Comments</h3>
                    {comments.length > 0 ? (
                        <ul>
                            {comments.map((comment) => (
                                comment.comment ? (
                                    <li key={comment.comment_id}>
                                        <p>{comment.comment}</p>
                                        <p className="username"><i>by <b>{comment.username}</b></i></p>
                                    </li>) : (null)
                            ))}
                        </ul>
                    ) : (
                        <div>
                            No comments available
                        </div>
                    )}

                    <textarea rows='4' cols='75' placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <br />
                    <button onClick={handleAddComment}>Add Comment</button>

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