'use client';

import { useState, useEffect } from 'react';
import { Comment, CommentFormData, LocalStorageDB } from '@/types';

interface CommentSystemProps {
  articleSlug: string;
  articleId: string;
  articleTitle: string;
}

export default function CommentSystem({ articleSlug, articleId, articleTitle }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentForm, setCommentForm] = useState<CommentFormData>({ content: '' });
  const [replyForms, setReplyForms] = useState<Record<string, string>>({});
  const [dailyCommentCount, setDailyCommentCount] = useState(0);
  const [dailyReplyCount, setDailyReplyCount] = useState(0);

  // Load comments for this article
  useEffect(() => {
    try {
      const localStorageDB: LocalStorageDB | undefined = window.localStorageDB;
      if (localStorageDB) {
        const articleComments = localStorageDB.getCommentsByArticle(articleSlug);
        setComments(articleComments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }, [articleSlug]);

  // Check daily limits
  useEffect(() => {
    const today = new Date().toDateString();
    const todayComments = comments.filter(comment => 
      new Date(comment.timestamp).toDateString() === today
    );
    const todayReplies = todayComments.reduce((total, comment) => 
      total + comment.replies.filter(reply => 
        new Date(reply.timestamp).toDateString() === today
      ).length, 0
    );
    
    setDailyCommentCount(todayComments.length);
    setDailyReplyCount(todayReplies);
  }, [comments]);

  const formatTimeAgo = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handlePostComment = () => {
    if (!commentForm.content.trim() || dailyCommentCount >= 100) return;

    try {
      const localStorageDB: LocalStorageDB | undefined = window.localStorageDB;
      if (!localStorageDB) return;

      const newComment = localStorageDB.createComment({
        articleId,
        articleSlug,
        articleTitle,
        author: 'Anonymous User', // In real app, this would be the logged-in user
        authorInitials: 'AU',
        authorColor: '#95EC6E',
        content: commentForm.content.trim(),
        replies: [],
        isHidden: false,
        isFlagged: false,
        parentId: undefined
      });

      setComments(prev => [newComment, ...prev]);
      setCommentForm({ content: '' });
      setDailyCommentCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handlePostReply = (commentId: string) => {
    if (!replyForms[commentId]?.trim() || dailyReplyCount >= 100) return;

    try {
      const localStorageDB: LocalStorageDB | undefined = window.localStorageDB;
      if (!localStorageDB) return;

      const parentComment = comments.find(c => c.id === commentId);
      if (!parentComment) return;

      const newReply = localStorageDB.createComment({
        articleId,
        articleSlug,
        articleTitle,
        author: 'Anonymous User',
        authorInitials: 'AU',
        authorColor: '#FFB34D',
        content: replyForms[commentId].trim(),
        replies: [],
        isHidden: false,
        isFlagged: false,
        parentId: commentId
      });

      // Update the parent comment with the new reply
      const updatedComments = comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      );

      setComments(updatedComments);
      setReplyForms(prev => ({ ...prev, [commentId]: '' }));
      setDailyReplyCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  return (
    <section id="comments" className="mt-16 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-light text-white mb-8">Comments</h2>
        
        {/* Comment Form */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Leave a Comment</h3>
          <div className="space-y-4">
            <textarea
              value={commentForm.content}
              onChange={(e) => setCommentForm({ content: e.target.value })}
              placeholder="Share your thoughts on this article..."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">
                {dailyCommentCount}/100 comments today
              </span>
              <button
                onClick={handlePostComment}
                disabled={!commentForm.content.trim() || dailyCommentCount >= 100}
                className="px-6 py-2 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded-lg hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: comment.authorColor }}
                  >
                    <span className="text-black text-sm font-medium">{comment.authorInitials}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{comment.author}</span>
                      {comment.isAdmin && (
                        <span className="px-2 py-1 bg-[rgb(var(--color-horizon-green))]/20 text-[rgb(var(--color-horizon-green))] text-xs rounded-full">Admin</span>
                      )}
                    </div>
                    <div className="text-sm text-white/60">
                      {formatTimeAgo(comment.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comment Content */}
              <div className="mb-4">
                <p className="text-white/90 leading-relaxed">{comment.content}</p>
              </div>

              {/* Reply Form */}
              <div className="mb-4">
                <button
                  onClick={() => setReplyForms(prev => ({ ...prev, [comment.id]: prev[comment.id] ? '' : ' ' }))}
                  className="text-[rgb(var(--color-horizon-green))] hover:underline text-sm"
                >
                  {replyForms[comment.id] ? 'Cancel Reply' : 'Reply'}
                </button>
                
                {replyForms[comment.id] && (
                  <div className="mt-3 space-y-3">
                    <textarea
                      value={replyForms[comment.id]}
                      onChange={(e) => setReplyForms(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      placeholder="Write a reply..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent resize-none text-sm"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">
                        {dailyReplyCount}/100 replies today
                      </span>
                      <button
                        onClick={() => handlePostReply(comment.id)}
                        disabled={!replyForms[comment.id]?.trim() || dailyReplyCount >= 100}
                        className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black font-medium rounded text-sm hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 space-y-3">
                  <h4 className="text-sm font-medium text-white/70 mb-2">Replies:</h4>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: reply.authorColor }}
                          >
                            <span className="text-black text-xs font-medium">{reply.authorInitials}</span>
                          </div>
                          <span className="font-medium text-white text-sm">{reply.author}</span>
                          {reply.isAdmin && (
                            <span className="px-2 py-1 bg-[rgb(var(--color-horizon-green))]/20 text-[rgb(var(--color-horizon-green))] text-xs rounded-full">Admin</span>
                          )}
                          <span className="text-xs text-white/60">{formatTimeAgo(reply.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-12 text-white/60">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
