
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchSlides, likeSlide, unlikeSlide, getUserStatus } from '../api';
import InteractiveWall from '../components/InteractiveWall';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import TippingModal from '../components/TippingModal';
import CommentsSection from '../components/CommentsSection'; // Import
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
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSlideId, setActiveSlideId] = useState(null);
  const [commentsVisible, setCommentsVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [slidesResponse, userStatusResponse] = await Promise.all([fetchSlides(), getUserStatus()]);
        setSlides(slidesResponse.data);
        if (slidesResponse.data.length > 0) {
          setActiveSlideId(slidesResponse.data[0]._id);
        }
        setCurrentUser({
          userId: userStatusResponse.data.user._id,
          avatarUrl: userStatusResponse.data.user.avatar || 'https://i.pravatar.cc/150?u=' + userStatusResponse.data.user._id,
          fullName: userStatusResponse.data.user.displayName,
        });
      } catch (err) {
        setError('Nie udało się załadować danych. Spróbuj ponownie później.');
        console.error('Błąd pobierania danych:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  const handleLikeToggle = async (slideId) => {
    const slide = slides.find(s => s._id === slideId);
    if (!slide) return;

    try {
      if (slide.isLiked) {
        await unlikeSlide(slideId);
        setSlides(slides.map(s => s._id === slideId ? { ...s, isLiked: false, likes: s.likes - 1 } : s));
      } else {
        await likeSlide(slideId);
        setSlides(slides.map(s => s._id === slideId ? { ...s, isLiked: true, likes: s.likes + 1 } : s));
      }
    } catch (err) {
      console.error("Błąd podczas zmiany statusu polubienia:", err);
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
        onSlideChange={(swiper) => {
          const activeIndex = swiper.realIndex;
          if (slides[activeIndex]) {
            setActiveSlideId(slides[activeIndex]._id);
            setCommentsVisible(false); // Ukryj komentarze przy zmianie slajdu
          }
        }}
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
              <div className="interactions">
                <div className="like-section">
                  <button onClick={() => handleLikeToggle(slide._id)} className={`like-button ${slide.isLiked ? 'liked' : ''}`}>
                    ❤️
                  </button>
                  <span>{slide.likes}</span>
                </div>
                <div className="comment-section-toggle">
                  <button onClick={() => setCommentsVisible(!commentsVisible)}>💬</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {commentsVisible && activeSlideId && currentUser && (
        <div className="comments-modal">
          <CommentsSection slideId={activeSlideId} currentUser={currentUser} />
        </div>
      )}
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
