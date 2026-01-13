import { Router } from "express";
import dayjs from "dayjs";
import "dayjs/locale/nl";

import { getAllEmails } from "./getAllEmails";
import { editSingleEmail } from "./updateSingleEmail";
import { deleteSingleEmail } from "./deleteSingleEmail";
import { createEmail } from "./createEmail";
import multer from "multer";
import { sendEmail } from "./sendEmail";

dayjs.locale("nl");

const router = Router();

router.get("/", getAllEmails);
router.patch("/:id", editSingleEmail);
router.delete("/:id", deleteSingleEmail);
router.post("/", createEmail);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 50, fileSize: 25 * 1024 * 1024 },
});

// POST /emails/sendEmail
router.post(
  "/sendEmail",
  upload.fields([
    { name: "images", maxCount: 40 },
    { name: "screenshots", maxCount: 2 },
  ]),
  sendEmail
);

export default router;
