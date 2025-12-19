import { ObjectId } from "mongodb"
import { createCollection } from "../../utils/createCollection.js"
import { likeUpdateType, RecipeType, recipeUpdateType } from "./recipe.types.js"

const createRecipe = async (payload: RecipeType) => {

    const recipeCollection = createCollection.recipeCollection()

    const result = await recipeCollection.insertOne(payload)

    return result
}

const getAllRecipes = async () => {

    const recipeCollection = createCollection.recipeCollection()

    const result = await recipeCollection.find({}).toArray()

    return result
}

const getSingleRecipe = async (recipeId: string) => {

    const recipeCollection = createCollection.recipeCollection()

    const filter = { _id: new ObjectId(recipeId) }

    const result = await recipeCollection.findOne(filter)

    return result

}

const updateRecipe = async (recipeId: string, payload: recipeUpdateType) => {

    const recipeCollection = createCollection.recipeCollection()

    const filter = { _id: new ObjectId(recipeId) }
    const updateDoc = {
        $set: payload
    }

    const result = await recipeCollection.updateOne(filter, updateDoc)

    return result
}

const updateLike = async (recipeId: string, payload: likeUpdateType) => {

    const recipeCollection = createCollection.recipeCollection()

    const filter = { _id: new ObjectId(recipeId) }
    const updateDoc = {
        $set: payload
    }

    const result = await recipeCollection.updateOne(filter, updateDoc)

    return result
}

const deleteRecipe = async (recipeId: string) => {

    const recipeCollection = createCollection.recipeCollection()

    const filter = { _id: new ObjectId(recipeId) }

    const result = await recipeCollection.deleteOne(filter)

    return result
}

export const recipeServices = {
    createRecipe,
    getAllRecipes,
    getSingleRecipe,
    updateRecipe,
    updateLike,
    deleteRecipe
}