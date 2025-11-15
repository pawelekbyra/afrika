
"use client";

import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import AuthContext from '@/context/AuthContext';
import { uploadAvatar, getDonationHistory } from '@/lib/api';
import api from '@/lib/api';

interface Donation {
  _id: string;
  amount: number;
  currency: string;
  createdAt: string;
}

const AccountPage = () => {
  const auth = useContext(AuthContext);
  const { user, setUser, logout } = auth || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });

      const fetchDonations = async () => {
        try {
          const { data } = await getDonationHistory();
          setDonations(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchDonations();
    }
  }, [user]);

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put('/users/password', passwordData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!avatar) return;
    const formData = new FormData();
    formData.append('avatar', avatar);
    try {
      const { data } = await uploadAvatar(formData);
      setUser?.({ ...user, avatar: data.avatar });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await api.delete('/users/profile');
        logout?.();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!auth || auth.loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your account.</div>;
  }

  return (
    <div>
      <h1>Account</h1>
      <img src={user.avatar} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      <form onSubmit={handleAvatarSubmit}>
        <input type="file" onChange={handleAvatarChange} />
        <button type="submit">Upload Avatar</button>
      </form>

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

      <div>
        <h2>Donation History</h2>
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              {donation.amount} {donation.currency.toUpperCase()} on {new Date(donation.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default AccountPage;
