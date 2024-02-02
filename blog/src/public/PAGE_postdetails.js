import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/COMPONENT_navbar";
import useAuth from "../functions/FUNCTION_auth";
import '../styles/postdetails.css'

var host = `http://localhost:9000/api`

export default function PostDetails() {
    useAuth()
    
    const post_id = useParams().post_id
    const currentuser = localStorage.getItem('username')

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(()=>{
        // fetch post and comments for that post seperately
        const fetchPost = async () => {
            try {
                const postResponse = await fetch(`${host}/blog/posts/post/${post_id}`)
                const postData = await postResponse.json()

                const commentResponse = await fetch(`${host}/blog/comments/post/${post_id}`)
                const commentData = await commentResponse.json()

                setPost(postData)
                setComments(commentData)
            } catch (err) {
                console.error('Error fetching post: ', err)
            }
        }

        fetchPost()
    },[post_id])

    // on clicking add comment, the comment is posted to backend, sets the response message and fetches the all the comments of this post again to show the new posted comment
    const handleAddComment = async() => {
        const commentData = { post_id: post_id, username: currentuser, comment: newComment}

        const response_post = await fetch(`${host}/blog/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
            headers: { 'Content-Type' : 'application/json' }
        })

        var data_post = await response_post.json()
        setMessage(data_post.message)
        
        const response_get = await fetch(`${host}/blog/comments/post/${post_id}`)
        var data_get = await response_get.json()
        setComments(data_get)
        setNewComment('')
    }

    return(
        <div>
            <NavBar />
            {post ? (
                <div className="container">
                    <h2>{post.title}</h2>
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