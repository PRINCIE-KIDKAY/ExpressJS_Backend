import express from 'express';
import AuthController from '../controllers/AuthController';

const router = express.Router();

// AUTHENTICATION ROUTES
router.post('/login', AuthController.login);
router.post('/register', AuthController.RegisterUser);
router.post('/verify', AuthController.VerifyUser);


export { router };