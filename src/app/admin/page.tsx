
"use client";

import React, { useState, useEffect, useContext, ChangeEvent, FormEvent } from 'react';
import AuthContext from '@/context/AuthContext';
import { getSlides, createSlide, updateSlide, deleteSlide } from '@/lib/api';

interface Slide {
  _id: string;
  type: 'video' | 'image';
  src: string;
  title: string;
  author: string;
}

const AdminPage = () => {
  const auth = useContext(AuthContext);
  const { user } = auth || {};

  const [slides, setSlides] = useState<Slide[]>([]);
  const [formData, setFormData] = useState<Partial<Slide>>({
    type: 'video',
    src: '',
    title: '',
    author: '',
  });

  useEffect(() => {
    if (user && user.isAdmin) {
      const fetchSlides = async () => {
        try {
          const { data } = await getSlides();
          setSlides(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSlides();
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await updateSlide(formData._id, formData);
      } else {
        await createSlide(formData);
      }
      const { data } = await getSlides();
      setSlides(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (slide: Slide) => {
    setFormData(slide);
  };

  const handleDeleteClick = async (slideId: string) => {
    try {
      await deleteSlide(slideId);
      const { data } = await getSlides();
      setSlides(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!auth || auth.loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return <h1>Not authorized</h1>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="hidden" name="_id" value={formData._id} />
        <select name="type" value={formData.type} onChange={handleInputChange}>
          <option value="video">Video</option>
          <option value="image">Image</option>
        </select>
        <input type="text" name="src" placeholder="Source URL" value={formData.src} onChange={handleInputChange} />
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} />
        <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleInputChange} />
        <button type="submit">{formData._id ? 'Update Slide' : 'Add Slide'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slides.map((slide) => (
            <tr key={slide._id}>
              <td>{slide.title}</td>
              <td>{slide.type}</td>
              <td>
                <button onClick={() => handleEditClick(slide)}>Edit</button>
                <button onClick={() => handleDeleteClick(slide._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
