import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const [slides, setSlides] = useState([]);
  const [formData, setFormData] = useState({
    _id: '',
    type: 'video',
    src: '',
    title: '',
    author: '',
  });

  useEffect(() => {
    if (user && user.isAdmin) {
      const fetchSlides = async () => {
        try {
          const { data } = await api.get('/slides');
          setSlides(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSlides();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        // Edycja
        await api.put(`/slides/${formData._id}`, formData);
      } else {
        // Dodawanie
        await api.post('/slides', formData);
      }
      // Odśwież listę
      const { data } = await api.get('/slides');
      setSlides(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (slide) => {
    setFormData(slide);
  };

  const handleDeleteClick = async (slideId) => {
    try {
      await api.delete(`/slides/${slideId}`);
      // Odśwież listę
      const { data } = await api.get('/slides');
      setSlides(data);
    } catch (error) {
      console.error(error);
    }
  };

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
