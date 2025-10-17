"use client"

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SocialActivity, Comment } from './useSocialWall';
import { User } from 'firebase/auth';

interface SocialActivityFeedProps {
  activities: SocialActivity[];
  praiseActivity: (activityId: string) => Promise<void>;
  onComment: (activityId: string, comment: string) => Promise<void>;
  onShare: (activityId: string) => Promise<void>;
  currentUser: User | null;
  showInteractionButtons?: boolean;
}

export function SocialActivityFeed({ 
  activities, 
  praiseActivity, 
  onComment, 
  onShare,
  currentUser,
  showInteractionButtons = true
}: SocialActivityFeedProps) {
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  const toggleComments = (activityId: string) => {
    setExpandedComments(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };
  
  const handleCommentChange = (activityId: string, value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [activityId]: value
    }));
  };
  
  const handleSubmitComment = async (activityId: string) => {
    const comment = commentInputs[activityId];
    if (!comment?.trim()) return;
    
    try {
      await onComment(activityId, comment);
      // Clear the input field after successful submission
      setCommentInputs(prev => ({
        ...prev,
        [activityId]: ''
      }));
      
      // Ensure comments are expanded after posting
      if (!expandedComments.includes(activityId)) {
        setExpandedComments(prev => [...prev, activityId]);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No activities with reflections yet.</p>
          <p className="text-sm mt-2">
            Share your run and reflection to inspire others!
          </p>
          {!currentUser && (
            <a href="/login">
              <Button className="mt-4">
                Sign In to Share
              </Button>
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            layout
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback>
                      {activity.userName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{activity.userName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-lg font-semibold">
                        {activity.distance.toFixed(1)} km in {activity.hours > 0 ? `${activity.hours} hr ${activity.minutes} min` : `${activity.minutes} min`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.location}
                      </p>
                      {activity.notes ? (
                        <div className="mt-3 p-4 bg-muted/20 rounded-lg border border-primary/20 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <h4 className="text-sm font-medium text-primary">Reflection</h4>
                          </div>
                          <p className="whitespace-pre-line text-sm">{activity.notes}</p>
                        </div>
                      ) : (
                        <div className="mt-3 text-xs text-muted-foreground italic">
                          No reflection shared for this activity
                        </div>
                      )}
                      
                      {(() => {
                        const allImages = [
                          ...(activity.imageUrl ? [activity.imageUrl] : []),
                          ...(activity.imageUrls || []),
                          ...(activity.images || [])
                        ].filter(Boolean);

                        if (allImages.length === 0) return null;

                        const gridClassName = allImages.length > 1
                          ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                          : "";

                        return (
                          <div className={`mt-4 ${gridClassName}`}>
                            {allImages.map((url, index) => (
                              <div key={index} className="relative w-full overflow-hidden rounded-lg border bg-muted/20">
                                <div className="aspect-[4/3] sm:aspect-video">
                                  <img
                                    src={url}
                                    alt={`Activity image ${index + 1}`}
                                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                    onError={(e) => console.error('Failed to load image:', url, e)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                    
                    {showInteractionButtons !== false && (
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => praiseActivity(activity.id!)}
                          className={`border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 py-1 h-8 text-xs ${currentUser && activity.praises?.includes(currentUser.uid) ? "bg-primary/10" : ""}`}
                        >
                          🙌 Praise God ({activity.praiseCount || 0})
                        </Button>
                        <Button 
                          onClick={() => toggleComments(activity.id!)}
                          className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 py-1 h-8 text-xs"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {activity.commentCount || 0} {activity.commentCount === 1 ? 'Comment' : 'Comments'}
                        </Button>
                        <Button 
                          onClick={() => onShare(activity.id!)}
                          className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-3 py-1 h-8 text-xs"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    )}
                    
                    {expandedComments.includes(activity.id!) && (
                      <div className="mt-4">
                        <Separator className="my-4" />
                        
                        {activity.comments && activity.comments.length > 0 ? (
                          <ScrollArea className="h-[200px] pr-4">
                            <div className="space-y-4">
                              {activity.comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.userAvatar} />
                                    <AvatarFallback>
                                      {comment.userName?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="bg-muted p-3 rounded-lg flex-1">
                                    <div className="flex justify-between items-start">
                                      <h4 className="text-sm font-semibold">{comment.userName}</h4>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                                      </p>
                                    </div>
                                    <p className="text-sm mt-1">{comment.content}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No comments yet. Be the first to comment!
                          </p>
                        )}
                        
                        {currentUser && (
                          <div className="mt-4 flex gap-2">
                            <Textarea
                              placeholder="Write a comment..."
                              className="min-h-[80px]"
                              value={commentInputs[activity.id!] || ''}
                              onChange={(e) => handleCommentChange(activity.id!, e.target.value)}
                            />
                            <Button 
                              onClick={() => handleSubmitComment(activity.id!)}
                              disabled={!commentInputs[activity.id!]?.trim()}
                              className="h-10 w-10 p-0 flex items-center justify-center"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
