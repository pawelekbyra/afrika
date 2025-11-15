
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api';

const AccountPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/password', passwordData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await api.delete('/users/profile');
        logout();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleFormChange}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleFormChange}
        />
        <button type="submit">Update Profile</button>
      </form>

      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />
        <button type="submit">Change Password</button>
      </form>

      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default AccountPage;
