// Plik: client/src/pages/VideoPlayerPage.jsx
// Wersja zaktualizowana do korzystania z nowej funkcji API i poprawionego modelu danych.

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchSlides } from '../api'; // Importujemy dedykowaną funkcję!

import 'swiper/css';
import './VideoPlayerPage.css';

const VideoPlayerPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSlides = async () => {
      try {
        setLoading(true);
        const response = await fetchSlides(); // Używamy nowej funkcji!
        setSlides(response.data);
      } catch (err) {
        setError('Nie udało się załadować wideo. Spróbuj ponownie później.');
        console.error('Błąd pobierania slajdów:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSlides();
  }, []);

  if (loading) {
    return <div className="loading-message">Ładowanie...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (slides.length === 0) {
    return <div className="info-message">Brak dostępnych wideo.</div>;
  }

  return (
    <Swiper
      direction={'vertical'}
      className="video-swiper"
      loop={true}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide._id} className="video-slide">
          {slide.type === 'video' && (
            <video src={slide.src} controls autoPlay muted loop playsInline />
          )}
          {slide.type === 'image' && (
            <img src={slide.src} alt={slide.title} className="slide-image" />
          )}
          <div className="video-info">
            <h3>{slide.title}</h3>
            <p>@{slide.author}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default VideoPlayerPage;
