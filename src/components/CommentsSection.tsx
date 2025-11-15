import React, { useState, useEffect } from 'react';
import { CommentSection } from 'react-comments-section';
import './CommentsSection.css';
import { getComments, addComment, editComment, deleteComment } from '@/lib/api';
import { CommentData, SubmitActionParams, EditActionParams, DeleteActionParams, IPopulatedComment } from '@/lib/models/interfaces';

interface CommentsSectionProps {
  slideId: string;
  currentUser: {
    userId: string;
    avatarUrl: string;
    fullName: string;
  } | null;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ slideId, currentUser }) => {
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await getComments(slideId);
        const formattedComments: CommentData[] = response.data.map((comment: IPopulatedComment) => ({
          userId: comment.author._id,
          comId: comment._id,
          fullName: comment.author.displayName,
          text: comment.content,
          avatarUrl: comment.author.avatar || 'https://i.pravatar.cc/150?u=' + comment.author._id,
          replies: [],
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

  const handleCommentSubmit = async (text: string, parentId: string | null = null) => {
    try {
      const response = await addComment(slideId, { content: text, parent: parentId || undefined });
      const newComment: CommentData = {
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

  const handleCommentEdit = async (text: string, comId: string) => {
    try {
      const response = await editComment(comId, { content: text });
      const updatedComment: CommentData = {
        userId: response.data.author._id,
        comId: response.data._id,
        fullName: response.data.author.displayName,
        text: response.data.content,
        avatarUrl: response.data.author.avatar || 'https://i.pravatar.cc/150?u=' + response.data.author._id,
        replies: [],
      };
      setComments(comments.map((c) => c.comId === comId ? updatedComment : c));
    } catch (error) {
      console.error('Błąd podczas edycji komentarza:', error);
    }
  };

  const handleCommentDelete = async (comId: string) => {
    try {
      await deleteComment(comId);
      setComments(comments.filter((c) => c.comId !== comId));
    } catch (error) {
      console.error('Błąd podczas usuwania komentarza:', error);
    }
  };

  return (
    <div className="comments-container">
      <CommentSection
        currentUser={currentUser}
        commentData={comments}
        onSubmitAction={({ text, parentOfRepliedCommentId }: SubmitActionParams) => handleCommentSubmit(text, parentOfRepliedCommentId)}
        onEditAction={({ text, comId }: EditActionParams) => handleCommentEdit(text, comId)}
        onDeleteAction={({ comIdToDelete }: DeleteActionParams) => handleCommentDelete(comIdToDelete)}
        currentData={(data: CommentData[]) => {
          console.log('current data', data);
        }}
      />
    </div>
  );
};

export default CommentsSection;
