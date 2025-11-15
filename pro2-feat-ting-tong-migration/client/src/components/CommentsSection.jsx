import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CommentSection } from 'react-comments-section';
import 'react-comments-section/dist/index.css';
import { getComments, addComment, editComment, deleteComment } from '../api';

const CommentsSection = ({ slideId, currentUser }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await getComments(slideId);
        const formattedComments = response.data.map(comment => ({
          userId: comment.author._id,
          comId: comment._id,
          fullName: comment.author.displayName,
          text: comment.content,
          avatarUrl: comment.author.avatar || 'https://i.pravatar.cc/150?u=' + comment.author._id,
          replies: [], // Na razie nie obsługujemy zagnieżdżonych odpowiedzi w ten sposób
        }));
        setComments(formattedComments);
      } catch (error) {
        console.error('Błąd podczas ładowania komentarzy:', error);
      }
    };

    if (slideId) {
      loadComments();
    }
  }, [slideId]);

  const handleCommentSubmit = async (text, parentId = null) => {
    try {
      const response = await addComment(slideId, { content: text, parent: parentId });
      const newComment = {
        userId: response.data.author._id,
        comId: response.data._id,
        fullName: response.data.author.displayName,
        text: response.data.content,
        avatarUrl: response.data.author.avatar || 'https://i.pravatar.cc/150?u=' + response.data.author._id,
        replies: [],
      };
      setComments([...comments, newComment]);
    } catch (error) {
      console.error('Błąd podczas dodawania komentarza:', error);
    }
  };

  const handleCommentEdit = async (text, comId) => {
    try {
      const response = await editComment(comId, { content: text });
      const updatedComment = {
        userId: response.data.author._id,
        comId: response.data._id,
        fullName: response.data.author.displayName,
        text: response.data.content,
        avatarUrl: response.data.author.avatar || 'https://i.pravatar.cc/150?u=' + response.data.author._id,
        replies: [],
      };
      setComments(comments.map(c => c.comId === comId ? updatedComment : c));
    } catch (error) {
      console.error('Błąd podczas edycji komentarza:', error);
    }
  };

  const handleCommentDelete = async (comId) => {
    try {
      await deleteComment(comId);
      setComments(comments.filter(c => c.comId !== comId));
    } catch (error) {
      console.error('Błąd podczas usuwania komentarza:', error);
    }
  };

  return (
    <div className="comments-container">
      <CommentSection
        currentUser={currentUser}
        commentData={comments}
        onSubmitAction={({ text, parentOfRepliedCommentId }) => handleCommentSubmit(text, parentOfRepliedCommentId)}
        onEditAction={({ text, comId }) => handleCommentEdit(text, comId)}
        onDeleteAction={({ comIdToDelete }) => handleCommentDelete(comIdToDelete)}
        currentData={(data) => {
          console.log('current data', data);
        }}
      />
    </div>
  );
};

CommentsSection.propTypes = {
  slideId: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default CommentsSection;
