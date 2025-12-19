import { Request, Response } from "express";
import { recipeServices } from "./recipe.services.js";

const createRecipe = async (req: Request, res: Response) => {
    try {
        const result = await recipeServices.createRecipe(req.body)
        res.status(201).send({
            success: true,
            message: "Recipe created successfully",
            data: result
        })
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

const getAllRecipes = async (req: Request, res: Response) => {
    try {
        const result = await recipeServices.getAllRecipes()
        res.status(200).send({
            success: true,
            message: "Recipes retrieved successfully",
            data: result
        })
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

const getSingleRecipe = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId
        const result = await recipeServices.getSingleRecipe(recipeId as string)
        res.status(200).send({
            success: true,
            message: "Recipe retrieved successfully",
            data: result
        })
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

const updateRecipe = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId
        const updatedData = req.body
        const result = await recipeServices.updateRecipe(recipeId as string, updatedData)
        res.status(200).send({
            success: true,
            message: "Recipe update successfully",
            data: result
        })
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

const updateLike = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId
        const updatedData = req.body
        const result = await recipeServices.updateLike(recipeId as string, updatedData)
        res.status(200).send({
            success: true,
            message: "Like update successfully",
            data: result
        })
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

const deleteRecipe = async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.recipeId
        const result = await recipeServices.deleteRecipe(recipeId as string)
        res.status(200).send({
            success: true,
            message: "Recipe delete successfully",
            data: result
        })
    }
    catch (err: any) {
        res.status(500).send({ message: err.message })
    }
}

export const recipeControllers = {
    createRecipe,
    getAllRecipes,
    getSingleRecipe,
    updateRecipe,
    updateLike,
    deleteRecipe
}