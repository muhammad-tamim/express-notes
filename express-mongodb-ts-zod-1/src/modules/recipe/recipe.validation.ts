import { z } from "zod";

const RecipeSchema = z.object({
    imageUrl: z.string(),
    title: z.string(),
    ingredients: z.string(),
    instructions: z.string(),
    cuisineType: z.array(z.string()),
    preparationTime: z.number().min(1),
    categories: z.array(z.string()),
    likeCount: z.number().optional().default(0),
});

const recipeUpdateSchema = z.object({
    imageUrl: z.string().optional(),
    title: z.string().optional(),
    ingredients: z.string().optional(),
    instructions: z.string().optional(),
    cuisineType: z.array(z.string()).optional(),
    preparationTime: z.number().min(1).optional(),
    categories: z.array(z.string()).optional(),
})

const likeUpdateSchema = z.object({
    likeCount: z.number()
})

export const RecipeValidation = {
    RecipeSchema,
    recipeUpdateSchema,
    likeUpdateSchema
}
