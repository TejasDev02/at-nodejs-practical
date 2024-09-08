import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import * as  Joi from 'joi';

const userService = new UserService();
const JWT_SECRET = 'your_jwt_secret'; // Replace with your secret key

export class UserController {
  async register(req: Request, res: Response) {
    const schema = Joi.object({
      username: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({success:0,message:error.details[0].message});

    try {
      const { username, email, password } = req.body;
     const user= await userService.register(username, email, password);
     if(user){ 
     res.status(200).send({success:1,message:"registation successfully"});
     }
    } catch (err:any) {
        res.status(500).send({success:0,message:err.message});

    }
  }

  async login(req: Request, res: Response) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({success:0,message:error.details[0].message});

    try {
      const { email, password } = req.body;
      const userData= await userService.login(email, password);
      if(userData){
        res.cookie('token', userData.token, { httpOnly: true });
        res.status(200).send({success:1,message:"login successfully"});
      }
  
    } catch (err:any) {
        res.status(500).send({success:0,message:err.message});
    }
  }

  async dashboard(req: Request, res: Response) {
    try {
      const user = await userService.getUserDetails(req.user.userId);
      res.render('dashboard',{user});
    } catch (err:any) {
        res.status(500).send({success:0,message:err.message});
    }
  }

  async changePassword(req: Request, res: Response) {
    const schema = Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({success:0,message:error.details[0].message});
  

    try {
      const { oldPassword, newPassword } = req.body;
     const data= await userService.changePassword(req.user.userId, oldPassword, newPassword);
      res.status(500).send({success:1,message:"Password updated successfully"});
    } catch (err:any) {
      res.status(500).send({success:0,message:err.message});
      
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    res.redirect('/login');
  }
}
