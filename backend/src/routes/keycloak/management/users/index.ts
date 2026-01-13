import { Router } from "express";
import { handleGetAllUsers } from "./getAllUsers";
import { handleGetUserById } from "./getUserById";
import { handleGetAvailableRoles } from "./getAvailableRoles";
import { handleUpdateUser } from "./updateUser";
import { handleUpdateUserRoles } from "./updateUserRoles";
import { handleCreateUser } from "./createUser";
import { handleDeleteUser } from "./deleteUser";
import { handleResetPassword } from "./resetPassword";

const router = Router();

// GET routes
router.get("/users", handleGetAllUsers);
router.get("/users/:id", handleGetUserById);
router.get("/roles", handleGetAvailableRoles);

// PUT routes
router.put("/users/:id", handleUpdateUser);
router.put("/users/:id/roles", handleUpdateUserRoles);
router.put("/users/:id/reset-password", handleResetPassword);

// POST routes
router.post("/users", handleCreateUser);

// DELETE routes
router.delete("/users/:id", handleDeleteUser);

export default router;

