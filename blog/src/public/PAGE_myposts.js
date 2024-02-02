import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom'
import NavBar from "../components/COMPONENT_navbar";
import useAuth from "../functions/FUNCTION_auth";
import '../styles/postlist.css'

var host = `http://localhost:9000/api`

export default function MyPostsPage() {
    useAuth()
    
    const username = localStorage.getItem('username')
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${host}/blog/posts/${username}`)
                const data = await response.json()
                setPosts(data)
            } catch (err) {
                console.error('Error fetching data: ', err)
            }
        }

        fetchPosts()
    },[username])
    
    return(
        <div>
            <NavBar />
            {/* If no posts are present, it displays no posts available message */}
            {posts.length > 0 ? (
                <div>
                    {
                        posts.map((post) => (
                            post.title ? (<div className='post' key={post.post_id}>
                                <Link className='link' to={`/post/${post.post_id}`}>
                                    <h3>{post.title}</h3>
                                    <p><i>by <b>{post.username}</b></i></p>
                                </Link>
                            </div>) : (null)
                        ))
                    }
                </div>
            ) : (
                <p> No posts available</p>
            )}
        </div>
    )
}