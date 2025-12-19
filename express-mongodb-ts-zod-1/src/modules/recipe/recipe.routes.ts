import { Router } from "express";
import { recipeControllers } from "./recipe.controllers.js";
import validateRequestData from "../../middleware/validateRequestData.js";
import { RecipeValidation } from "./recipe.validation.js";

const router = Router()

router.post("/", validateRequestData(RecipeValidation.RecipeSchema), recipeControllers.createRecipe)
router.get("/", recipeControllers.getAllRecipes)
router.get("/:recipeId", recipeControllers.getSingleRecipe)
router.patch("/:recipeId", validateRequestData(RecipeValidation.recipeUpdateSchema), recipeControllers.updateRecipe)
router.patch("/:recipeId/like", validateRequestData(RecipeValidation.likeUpdateSchema), recipeControllers.updateLike)
router.delete("/:recipeId", recipeControllers.deleteRecipe)

export const recipeRoutes = router