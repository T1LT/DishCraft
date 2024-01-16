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
  const [optimisticLikes, setOptimisticLike] = useOptimistic(
    likes,
    (state, _) => (userLiked ? state - 1 : state + 1),
  );
  const [optimisticUserLiked, setOptimisticUserLiked] = useOptimistic(
    userLiked,
    (state, _) => !state,
  );

  const handleLike = async () => {
    setOptimisticLike(1);
    setOptimisticUserLiked(!userLiked);
    await changeLike(recipeId, optimisticLikes, optimisticUserLiked);
  };

  return (
    <div className="flex items-center space-x-2 h-max">
      <Heart
        className="h-6 w-6 cursor-pointer text-red-500"
        onClick={handleLike}
        fill={optimisticUserLiked ? "red" : "none"}
      />
      <span className="text-lg tabular-nums">{Number(optimisticLikes)}</span>
    </div>
  );
}
