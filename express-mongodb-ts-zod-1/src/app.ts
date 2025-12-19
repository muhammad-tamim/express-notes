import express, { Request, Response } from "express";
import cors from "cors";
import { initDB } from "./config/db.js";
import { recipeRoutes } from "./modules/recipe/recipe.routes.js";


const app = express()
app.use(cors())
app.use(express.json())


initDB()

app.use("/api/v1/recipe", recipeRoutes)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use((req: Request, res: Response) => {
    res.status(404).send({
        error: "Route Not Found",
        path: req.path
    })
})

export default app