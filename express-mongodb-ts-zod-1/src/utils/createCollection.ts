import { getDB } from "../config/db.js"

const recipeCollection = () => {
    return getDB().collection("recipeCollection")
}

export const createCollection = {
    recipeCollection
}