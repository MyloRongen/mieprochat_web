import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import PostViewModel from "./viewModels/PostViewModel";

function App() {
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        (async () => {
            await loadPosts();
        })();
    }, []);

    async function loadPosts() {
        try {
            const response = await axios.get("http://localhost:8080/api/posts");
            const posts = response.data;

            const postViewModels = posts.map(post => new PostViewModel(post));

            console.log(postViewModels);
            setPosts(postViewModels);
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    }

    async function save() {
        try {
            const minimalPost = {
                id: null,
                description: description,
                createdAt: null,
                updatedAt: null
            };

            alert(minimalPost.description);

            await axios.post("http://localhost:8080/api/create/post", minimalPost);

            setDescription("");
            await loadPosts();
        } catch (err) {
            console.error("Error creating post:", err);
            alert("Error creating post");
        }
    }

    return (
        <div className="App">
            <div>
                {posts.map((post, index) => (
                    <div className="pb-10" key={index}>
                        <div>
                            <p>{post.description}</p>
                            <p>{post.createdAt}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <form className="pt-6 w-96" onSubmit={(event) => {
                    event.preventDefault();
                    save();
                }}>
                    <div>
                        <label htmlFor={`description`}>Maak je posts hier onder</label>
                        <input
                            type="text"
                            id={`description`}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </div>

                    <div className="flex justify-end w-full gap-2 pt-6">
                        <div>
                            <button type="submit" className="w-96 bg-blue-400 text-white py-2 px-4 rounded-md">
                                Create Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    );
}

export default App;
