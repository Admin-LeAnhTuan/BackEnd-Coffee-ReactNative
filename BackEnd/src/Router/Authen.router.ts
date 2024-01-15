import {
    register,
    activation,
    login,
    forgetPassword,
    resetPassword,
    chagePassword
} from "../controller/Authen.controller"
import express from "express"
const router = express.Router();

router.post("/register", register);
router.post("/activation/:token", activation);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/chagePassword", chagePassword);

export default router;