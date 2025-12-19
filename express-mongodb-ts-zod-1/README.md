# Project: Recipe Sharing Platform
 
This is a Recipe Sharing Platform backend where users can add & manage their recipes, discover recipes from others, and like recipes. 

## Tech Stack:
- Node.js, Express, MongoDB, Zod, TypeScript, Dotenv, Cors
  
## What i learn new while building this server:
- Zod: I used zod first time for this project for schema validation:

```ts
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
```

```ts
import { z } from "zod";
import { RecipeValidation } from "./recipe.validation.js";

export type RecipeType = z.infer<typeof RecipeValidation.RecipeSchema>
export type recipeUpdateType = z.infer<typeof RecipeValidation.recipeUpdateSchema>
export type likeUpdateType = z.infer<typeof RecipeValidation.likeUpdateSchema> 
```

- How to build a backend project with Modular Architecture: 

```
src/
    module/
        recipe/
            recipe.routes.ts
            recipe.controllers.ts
            recipe.services.ts
```


## Project Architecture:

I used Modular Architecture for this backend project: 

```
src/
    config/
        db.ts -- MongoDB connection
        env.ts
    middleware/
        validateRequestData.ts
    module/
        recipe/
            recipe.routes.ts
            recipe.controllers.ts
            recipe.services.ts
            recipe.types.ts
            recipe.validation.ts
    utils/
        createCollection.ts
    app.ts -- Express application configuration
    server.ts -- Entry point
```


## API Documentation:

### Live Api URL:

```
https://web-project-27-server.vercel.app/
```

### Base URL: 

```
/api/v1/recipe
```

### EndPoints: 

1. Create a Recipe: 

```
POST: /api/v1/recipe/
```
Request Body: 

```json
{
	"imageUrl": "",
	"title": "Chicken Biryani",
	"ingredients": "Chiken, Rice",
	"instructions": "Layer rice and chicken, cook on low heat.",
	"cuisineType": [ "indian"],
	"preparationTime": 30,
	"categories": ["launch", "Dinner"],
	"likeCount": 0
}
```

Response(201): 

```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "acknowledged": true,
    "insertedId": "656f0b2a1e23bc..."
  }
}
```

2. Get All Recipes:

```
GET: /api/v1/recipe/
```

Response(200): 

```json
{
  "success": true,
  "message": "Recipes retrieved successfully",
  "data": [
    {
      "_id": "656f0b2a1e23bc...",
      "title": "Spaghetti Carbonara",
      "ingredients": ["Pasta", "Eggs"],
      "instructions": "...",
      "likes": 10
    }
  ]
}
```
3. Get Single Recipe:

```
GET: /api/v1/recipe/:recipeId
```

Response(200):

```json
{
  "success": true,
  "message": "Recipe retrieved successfully",
  "data": {
    "_id": "656f0b2a1e23bc...",
    "title": "Spaghetti Carbonara",
    "ingredients": ["Pasta", "Eggs"],
    "likes": 10
  }
}
```

4. Update Recipe:

```
PATCH: /api/v1/recipe/:recipeId
```

Request Body (Partial Update Allowed, not including likeCount):

```json
{
  "title": "Updated Title",
  "ingredients": "New ingredient"
}
```

Response (200):

```json
{
  "success": true,
  "message": "Recipe update successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 1
  }
}
```

5. Update Recipe Like Count:

```
PATCH: /api/v1/recipe/:recipeId/like
```

Request Body:

```json
{
  "likesCount": 15
}
```

Response (200):

```json
{
  "success": true,
  "message": "Like update successfully",
  "data": {
    "acknowledged": true,
    "modifiedCount": 1
  }
}
```

6. Delete Recipe:

```
DELETE: /api/v1/recipe/:recipeId
```

Response (200):

```json
{
  "success": true,
  "message": "Recipe delete successfully",
  "data": {
    "acknowledged": true,
    "deletedCount": 1
  }
}
```



## Installation & Setup:

1. Clone the Repository: 

```bash
git clone https://github.com/muhammad-tamim/web-project-27-server.git
cd server
```

2. Install Dependencies:

```bash
npm install
```

3. Create a .env File with: 

```
MONGODB_URI=Your MongoDB URI
PORT= Your Port
DB_NAME = RecipeBookDB
```

4. Start the Development Server(For locally testing):

```bash
npm run dev
```