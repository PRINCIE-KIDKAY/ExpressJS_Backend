import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

// USER
router.post('/create_user', UserController.createUser);
router.put('/update_user', UserController.updateUser);
router.delete('/delete_user', UserController.deleteUser);
router.put('/change_password', UserController.ChangePassword);


export { router };