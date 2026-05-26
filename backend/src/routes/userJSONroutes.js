import express from "express";
import { getUserJSON, saveExtractedJSON } from "../controllers/userJSONController.js";

const router = express.Router();

router.post("/save", saveExtractedJSON);
router.get("/:custom_id", getUserJSON);

export default router;
