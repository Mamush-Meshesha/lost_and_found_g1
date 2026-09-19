import express from "express"
import { loginUser, registerUser } from "../controllers/authControllers";


const router = express.Router();


 router.post("/registerUser", registerUser )
 router.post("/loginUser", loginUser )


 export default router;