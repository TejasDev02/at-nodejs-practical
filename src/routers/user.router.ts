import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();
  
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/dashboard', authenticateJWT, userController.dashboard);
router.post('/change-password', authenticateJWT, userController.changePassword);
router.post('/logout', userController.logout);

export default router;
