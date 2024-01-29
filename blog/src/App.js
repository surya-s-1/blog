import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginAndRegister from "./public/PAGE_loginandregister";
import AllPosts from "./public/PAGE_allposts";
import MyPostsPage from "./public/PAGE_myposts";
import PostDetails from "./public/PAGE_postdetails";
import NewPost from "./public/PAGE_newpost";

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LoginAndRegister />} />
        <Route exact path="/home" element={<AllPosts />} />
        <Route exact path="/myposts" element={<MyPostsPage />} />
        <Route exact path="/newpost" element={<NewPost />} />
        <Route path="/post/:post_id" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  )
}