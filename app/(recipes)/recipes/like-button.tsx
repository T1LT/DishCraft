"use client";

import { useOptimistic } from "react";
import { changeLike } from "../actions";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  likes: number;
  recipeId: string;
  userLiked: boolean;
}

export default function LikeButton({
  likes,
  recipeId,
  userLiked,
}: LikeButtonProps) {
  const [optimisticUserLiked, setOptimisticUserLiked] = useOptimistic(
    userLiked,
    (state, _) => !state,
  );

  const handleLike = async () => {
    setOptimisticUserLiked(!userLiked);
    await changeLike(recipeId, likes, optimisticUserLiked);
  };

  return (
    <div className="flex items-center space-x-2 h-max">
      <Heart
        className="h-6 w-6 cursor-pointer text-red-500"
        onClick={handleLike}
        fill={optimisticUserLiked ? "red" : "none"}
      />
    </div>
  );
}
