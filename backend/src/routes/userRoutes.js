import express from "express";
const router = express.Router();

import {
    registerUser,
    updateUserController,
    getAllUsers,
    getUserByIdController,
    getUserByEmailController,
    deleteUser,
} from "../controllers/userController.js";

router.post("/", registerUser);
router.put("/:id", updateUserController);
router.get("/", getAllUsers);
router.get("/:id", getUserByIdController);
router.get("/email/:email", getUserByEmailController);
router.delete("/:id", deleteUser);

export default router;