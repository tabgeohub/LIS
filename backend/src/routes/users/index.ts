import { Router } from "express";
import { getUsers } from "./getUsers";
import { createUser } from "./createUser";
import { updateUser } from "./updateUser";

const router = Router();

// Get
router.get("/", getUsers);

// Post
router.post("/", createUser);

// Patch
router.patch("/", updateUser);

export default router;
