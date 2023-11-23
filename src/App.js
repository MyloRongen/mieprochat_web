import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import PostViewModel from "./viewModels/PostViewModel";

function App() {
    const [posts, setPosts] = useState([]);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken == null) {
                setLoggedIn(false);
                localStorage.clear();
            } else {
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    const response = await fetch('http://localhost:8080/tokens/refreshToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: refreshToken,
                        }),
                    });

                    const data = await response.json();
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.token);

                    setLoggedIn(true);
                    await loadPosts();
                } catch (err) {
                    setLoggedIn(false);
                    localStorage.clear();
                }
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setLoggedIn(false);
    };

    const login = async () => {
        try {
            const response = await fetch('http://localhost:8080/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.token);

            setLoggedIn(true);
            await loadPosts();
        } catch (error) {
            console.error('Error during login:', error);
            setLoggedIn(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        login();
    };

    async function save() {
        try {
            const storedAccessToken = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('description', description);
            formData.append('image', image);

            await axios.post("http://localhost:8080/api/create/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${storedAccessToken}`,
                }
            });

            setDescription("");
            await loadPosts();
        } catch (err) {
            console.error("Error creating post:", err);
            await loadPosts();
        }
    }

    async function loadPosts() {
        try {
            const storedAccessToken = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8080/api/tests', {
                headers: {
                    Authorization: `Bearer ${storedAccessToken}`,
                },
            });

            const posts = response.data;
            const postViewModels = posts.map(post => new PostViewModel(post));

            setPosts(postViewModels);
        } catch (err) {
            console.error("Error loading posts:", err);
            setLoggedIn(false);
            localStorage.removeItem(localStorage.getItem('accessToken'));
        }
    }

    return (
        <div className="w-full">
            {isLoggedIn ? (
                <div>
                    <div className="flex w-full">
                        <button type="button" onClick={handleLogout} className="bg-blue-400 text-white py-2 px-4 rounded-md">
                            Logout
                        </button>
                    </div>

                    <div className="flex w-full justify-center">
                        <form className="pt-6 w-96" encType="multipart/form-data" onSubmit={(event) => {
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

                            <div>
                                <label htmlFor={`image`}>Upload Image</label>
                                <input
                                    type="file"
                                    id={`image`}
                                    accept="image/*"
                                    onChange={(event) => setImage(event.target.files[0])}
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

                    <div className="pt-20">
                        {[...posts].reverse().map((post, index) => (
                            <div className="pb-10 flex justify-center w-full" key={index}>
                                <div className="w-96">
                                    <p>{post.description}</p>
                                    <img src={`http://localhost:8080/api/images/${post.imageUrl}`} className="w-96"
                                         alt="Image"/>
                                    <p>{post.username}</p>
                                    <p>{post.createdAt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                ):(
                <div className="flex justify-center items-center h-screen">
                    <form onSubmit={handleSubmit} className="w-60">
                        <h1 className="text-center text-3xl font-medium mb-10">Miepro socialmedia</h1>
                        <label>Username:</label>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        <br/>
                        <label>Password:</label>
                            <input
                                type="password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        <br/>
                        <div className="w-full flex justify-center">
                            <button type="submit" className="bg-blue-400 text-white py-2 px-4 rounded-md">Login</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
        );
    }

export default App;