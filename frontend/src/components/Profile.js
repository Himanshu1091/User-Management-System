import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { email } = useParams();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8080/api/users/profile/${email}`)
        .then(res => setUser(res.data))
        .catch(() => setMessage('Failed to fetch profile.'));
    }
  }, [email]);

  if (!email) return <p>Please login to see profile.</p>;

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: 20 }}>
      <h2>Profile</h2>
      {user ? (
        <div className="card p-3">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : <p>{message || "Loading..."}</p>}
    </div>
  );
};

export default Profile;
