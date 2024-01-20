"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Info } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { editRecipe, type SubmitRecipeData } from "@/app/(recipes)/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Switch } from "@/components/ui/switch";
import { recipesTable } from "@/app/db";
import Link from "next/link";

type RecipeType = typeof recipesTable.$inferSelect;

export default function UpdateRecipeForm({ recipe }: { recipe: RecipeType }) {
  const editRecipeWithArgs = editRecipe.bind(
    null,
    recipe.id,
    recipe.submitted_by,
  );
  const [state, formAction] = useFormState(editRecipeWithArgs, {});

  return (
    <form action={formAction} className="w-full max-w-md">
      <h1 className="text-center text-3xl font-bold mb-4">Edit Recipe</h1>
      <RecipeFormFields recipe={recipe} state={state ?? {}} />
    </form>
  );
}

export function RecipeFormFields({
  recipe,
  state,
}: {
  recipe: RecipeType;
  state: SubmitRecipeData;
}) {
  const { error } = state;
  const { pending } = useFormStatus();

  const [ingredientsInput, setIngredientsInput] = useState(recipe.ingredients);
  const [procedureInput, setProcedureInput] = useState(recipe.procedure);
  const [ingredientsPreviewToggle, setIngredientsPreviewToggle] =
    useState(false);
  const [procedurePreviewToggle, setProcedurePreviewToggle] = useState(false);

  return (
    <div className="space-y-4 py-1">
      <div className="flex flex-col flex-grow space-y-2 items-start">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="title"
        >
          Title
        </label>
        <Input
          id="title"
          name="title"
          autoFocus
          disabled={pending}
          defaultValue={recipe.title}
          placeholder="Enter Title"
          type="text"
        />
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.title != null ? (
        <ErrorMessage errors={error.fieldErrors.title} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="cuisine"
        >
          Cuisine
        </label>
        <Input
          id="cuisine"
          name="cuisine"
          disabled={pending}
          defaultValue={recipe.cuisine}
          placeholder="Enter Cuisine"
          type="text"
        />
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.cuisine != null ? (
        <ErrorMessage errors={error.fieldErrors.cuisine} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="category"
        >
          Category
        </label>
        <Input
          id="category"
          name="category"
          disabled={pending}
          defaultValue={recipe.category}
          placeholder="Enter Category"
          type="text"
        />
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.category != null ? (
        <ErrorMessage errors={error.fieldErrors.category} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="image"
        >
          Image (optional)
        </label>
        <Input
          id="image"
          name="image"
          disabled={pending}
          type="file"
          accept="image/jpg, image/jpeg, image/png, image/webp"
        />
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.image != null ? (
        <ErrorMessage errors={error.fieldErrors.image} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="prepTime"
        >
          Prep Time (min)
        </label>
        <Input
          id="prepTime"
          name="prepTime"
          disabled={pending}
          defaultValue={recipe.prepTime}
          placeholder="Enter Prep Time"
          type="number"
        />
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.prepTime != null ? (
        <ErrorMessage errors={error.fieldErrors.prepTime} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <div className="w-full flex justify-between">
          <label
            className="flex items-center gap-1 text-sm font-medium text-gray-700"
            htmlFor="ingredients"
          >
            Ingredients
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="text-center">
                  <p>Markdown is supported!</p>
                  <p className="text-xs">(No images though)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <label htmlFor="ingredients-preview">Preview</label>
            <Switch
              id="ingredients-preview"
              disabled={!ingredientsInput.length}
              aria-disabled={!ingredientsInput.length}
              checked={ingredientsPreviewToggle}
              onCheckedChange={() =>
                setIngredientsPreviewToggle((prev) => !prev)
              }
            />
          </div>
        </div>
        {ingredientsPreviewToggle ? (
          <div className="w-full px-3 py-2 border rounded-md !text-sm">
            <MarkdownRenderer>{ingredientsInput}</MarkdownRenderer>
          </div>
        ) : (
          <Textarea
            id="ingredients"
            name="ingredients"
            disabled={pending}
            placeholder="Enter Ingredients"
            rows={4}
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
          />
        )}
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.ingredients != null ? (
        <ErrorMessage errors={error.fieldErrors.ingredients} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <div className="w-full flex justify-between">
          <label
            className="flex items-center gap-1 text-sm font-medium text-gray-700"
            htmlFor="procedure"
          >
            Procedure
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="text-center">
                  <p>Markdown is supported!</p>
                  <p className="text-xs">(No images though)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <label htmlFor="procedure-preview">Preview</label>
            <Switch
              id="procedure-preview"
              disabled={!procedureInput.length}
              aria-disabled={!procedureInput.length}
              checked={procedurePreviewToggle}
              onCheckedChange={() => setProcedurePreviewToggle((prev) => !prev)}
            />
          </div>
        </div>
        {procedurePreviewToggle ? (
          <div className="w-full px-3 py-2 border rounded-md !text-sm">
            <MarkdownRenderer>{procedureInput}</MarkdownRenderer>
          </div>
        ) : (
          <Textarea
            id="procedure"
            name="procedure"
            disabled={pending}
            placeholder="Enter Procedure"
            onKeyDown={(e) => {
              if (
                (e.ctrlKey || e.metaKey) &&
                (e.key === "Enter" || e.key === "NumpadEnter")
              ) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            rows={4}
            value={procedureInput}
            onChange={(e) => setProcedureInput(e.target.value)}
          />
        )}
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.procedure != null ? (
        <ErrorMessage errors={error.fieldErrors.procedure} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <div className="w-16" />
        <div className="mt-1 w-full flex justify-center">
          <div className="w-full flex gap-2 justify-end">
            <Button variant="outline" disabled={pending} asChild>
              <Link href={`/${recipe.id.replace("_", "/")}`}>Cancel</Link>
            </Button>
            <Button disabled={pending} type="submit">
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>

          {error && "message" in error ? (
            <p className="mt-4 text-md text-red-500">{error.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ errors }: { errors: string[] }) {
  return (
    <div className="flex flex-col items-start">
      <div className="w-16" />
      <div className="mt-1 text-sm text-red-500">
        {errors.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>
    </div>
  );
}
