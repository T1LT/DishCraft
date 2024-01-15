"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { submitRecipe, type SubmitRecipeData } from "../actions";

export default function RecipeForm() {
  const [state, formAction] = useFormState(submitRecipe, {});

  return (
    <form action={formAction} className="w-full max-w-md px-4 sm:px-0">
      <h1 className="text-center text-3xl font-bold mb-4">Add a Recipe</h1>
      <RecipeFormFields {...state} />
    </form>
  );
}

export function RecipeFormFields({ error }: SubmitRecipeData) {
  const { pending } = useFormStatus();

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
          Image
        </label>
        <Input
          id="image"
          name="image"
          disabled={pending}
          type="file"
          required
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
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="ingredients"
        >
          Ingredients
        </label>
        <Textarea
          id="ingredients"
          name="ingredients"
          disabled={pending}
          placeholder="Enter Ingredients"
          rows={4}
        />
      </div>
      {!pending &&
      error &&
      "fieldErrors" in error &&
      error.fieldErrors.ingredients != null ? (
        <ErrorMessage errors={error.fieldErrors.ingredients} />
      ) : null}
      <div className="flex flex-col space-y-2 items-start">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="procedure"
        >
          Procedure
        </label>
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
        />
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
          <Button disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit
          </Button>

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
    <div className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-4 items-start">
      <div className="w-16" />
      <div className="mt-1 text-md text-red-500">
        {errors.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>
    </div>
  );
}
