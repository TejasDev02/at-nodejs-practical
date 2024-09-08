import { Request, Response, NextFunction } from 'express';
import * as  jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Ensure this matches the secret used in the service

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if(!req.cookies.token){
    res.render("/login")
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);

      req.user = user; // Attach user info to the request
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
