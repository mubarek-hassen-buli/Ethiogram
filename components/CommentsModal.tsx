import { View, Text } from 'react-native'
import React from 'react'
import { Id } from '@/convex/_generated/dataModel';
type CommentsModalProps = {
    postId: Id<"posts">;
    visible: boolean;
    onClose: () => void;
    onCommentAdded: () => void;
  };
export default function CommentsModal({ postId, visible, onClose, onCommentAdded }: CommentsModalProps) {
  return (
    <View>
      <Text>CommentsModal</Text>
    </View>
  )
}