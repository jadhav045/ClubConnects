import { useRef, useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import axios from "axios";

const MyEditor = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]); // Stores saved posts

  // Fetch saved posts on page load
  // useEffect(() => {
  //   axios.get("http://localhost:5000/get-posts")
  //     .then((response) => setPosts(response.data))
  //     .catch((error) => console.error("Error fetching posts:", error));
  // }, []);

  // Function to save content when "Post" is clicked
  const handlePost = async () => {
    try {
      console.log(content);
      await axios.post("http://localhost:5000/save-post", { content });
      setPosts([...posts, content]); // Update UI with the new post
      setContent(""); // Clear the editor after posting
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <>
      <h1>Rich Text Editor</h1>
      <JoditEditor ref={editor} value={content} onChange={setContent} />
      <button onClick={handlePost} style={{ marginTop: "10px", padding: "8px 15px", cursor: "pointer" }}>
        Post
      </button>
      
      
    </>
  );
};

export default MyEditor;
