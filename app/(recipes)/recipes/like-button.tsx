"use client";

import { useOptimistic } from "react";
import { addLike } from "../actions";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  likes: number;
  recipeId: string;
}

export default function LikeButton({ likes, recipeId }: LikeButtonProps) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state, _) => state + 1,
  );

  return (
    <div className="flex items-center space-x-2 h-max">
      <Heart
        className="h-6 w-6 cursor-pointer"
        onClick={async () => {
          addOptimisticLike(1);
          await addLike(recipeId, optimisticLikes);
        }}
      />
      <span className="text-lg">{Number(optimisticLikes)}</span>
    </div>
  );
}
