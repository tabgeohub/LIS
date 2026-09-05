import { Router } from "express";
import { getUsers } from "./getUsers";
import { createUser } from "./createUser";
import { updateUser } from "./updateUser";

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Application user list and profile updates
 */
const router = Router();

router.get("/", getUsers);

// Post
router.post("/", createUser);

// Patch
router.patch("/", updateUser);

export default router;
