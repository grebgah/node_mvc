import { Router } from "express";

import PasteController from "./controllers/paste.js";
import NoteController from "./controllers/note.js"
import { catchError } from "./middlewares/error.js";


const router = new Router();


//router.get("/", [PasteController.getAllPastes, catchError]);
router.get("/paste/:id", [PasteController.getPaste, catchError]);
router.get("/paste", PasteController.getCreateNewPaste);
router.post("/paste", [PasteController.postCreateNewPaste, catchError]);
router.get("/delete/:id", [PasteController.deletePaste, catchError]);

router.get("/", [NoteController.getAllNotes, catchError])
router.get("/note", NoteController.getCreateNewNote)
router.post("/note", [NoteController.postCreateNewNote, catchError])
router.get("/note/:id", [NoteController.getNote, catchError])

router.get("/delete_note/:id",[NoteController.deleteNote, catchError])

router.get("/note_update/:id", [NoteController.getUpdateNote])
router.post("/note_update/:id", [NoteController.postUpdateNote])

export default router;