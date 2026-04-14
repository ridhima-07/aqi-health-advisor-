import express from "express";
const router = express.Router();

import {
    completeUserProfile,
    updateUserController,
    getAllUsers,
    getUserByIdController,
    getUserByEmailController,
    deleteUser,
} from "../controllers/userController.js";

router.put("/:id/profile", completeUserProfile);
router.put("/:id", updateUserController);
router.get("/", getAllUsers);
router.get("/email/:email", getUserByEmailController);
router.get("/:id", getUserByIdController);
router.delete("/:id", deleteUser);

export default router;