"use client";

import { Button } from "@/components/ui/button";
import { deleteRecipe } from "@/app/(recipes)/actions";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface DeleteRecipeProps {
  recipeId: string;
  submittedBy: string;
}

export default function DeleteRecipe({
  recipeId,
  submittedBy,
}: DeleteRecipeProps) {
  const deleteRecipeWithArgs = deleteRecipe.bind(null, recipeId, submittedBy);

  return (
    <form action={deleteRecipeWithArgs}>
      <DeleteRecipeButton />
    </form>
  );
}

export function DeleteRecipeButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Continue
    </Button>
  );
}
