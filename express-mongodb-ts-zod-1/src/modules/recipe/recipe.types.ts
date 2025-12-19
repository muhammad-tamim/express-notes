import { z } from "zod";
import { RecipeValidation } from "./recipe.validation.js";

export type RecipeType = z.infer<typeof RecipeValidation.RecipeSchema>
export type recipeUpdateType = z.infer<typeof RecipeValidation.recipeUpdateSchema>
export type likeUpdateType = z.infer<typeof RecipeValidation.likeUpdateSchema> 