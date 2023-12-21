import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userPostDetails, setUserPostDetails] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchUsers();
    fetchPosts();
  }, []);

  useEffect(() => {
    const combinedData = users.map((user) => ({
      ...user,
      posts: posts.filter((post) => post.userId === user.id),
    }));

    setUserPostDetails(combinedData);
  }, [users, posts]);

  const handleUserDetails = (user) => {
    navigate(`/profile/${user.id}`, { state: { user } });
  };

  return (
    <div className="container">
      <h1>User Posts</h1>
      <div className="main-div">
        {userPostDetails.map((user) => (
          <div
            onClick={() => {
              handleUserDetails(user);
            }}
            key={user.id}
            className="users"
          >
            <h1 className="user-heading">Name:{user.name}</h1>
            <h1 className="user-heading">Posts:{user.posts.length}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
