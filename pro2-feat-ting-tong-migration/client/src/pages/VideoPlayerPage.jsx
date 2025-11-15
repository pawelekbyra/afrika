
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchSlides } from '../api';
import InteractiveWall from '../components/InteractiveWall';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import TippingModal from '../components/TippingModal';
import api from '../api';

import 'swiper/css';
import './VideoPlayerPage.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const VideoPlayerPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [destroyedWalls, setDestroyedWalls] = useState(new Set());
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const loadSlides = async () => {
      try {
        setLoading(true);
        const response = await fetchSlides();
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

  const handleWallDestroyed = (slideId) => {
    setDestroyedWalls((prev) => new Set(prev).add(slideId));
  };

  const createPaymentIntent = async () => {
    try {
      const response = await api.post('/payment/create-payment-intent', {
        amount: 10,
        currency: 'usd',
      });
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error(error);
    }
  };

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
    <>
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
            {!destroyedWalls.has(slide._id) && (
              <div className="interactive-wall-overlay">
                <InteractiveWall onWallDestroyed={() => handleWallDestroyed(slide._id)} />
              </div>
            )}
            <div className="video-info">
              <h3>{slide.title}</h3>
              <p>@{slide.author}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button onClick={createPaymentIntent} className="tip-button">Give a Tip</button>
      {clientSecret && (
        <div className="tipping-modal-container">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <TippingModal />
          </Elements>
        </div>
      )}
    </>
  );
};

export default VideoPlayerPage;
