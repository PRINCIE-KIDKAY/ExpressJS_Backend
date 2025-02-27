import { Request, Response } from 'express';
import CommonUtils from '../utils/CommonUtils';
import { db } from '../db/drizzle.config';
import { eq, and } from "drizzle-orm";
import axios from 'axios';
import { users } from '../db/schemas/UserSchema';
import ResponseUtils from '../utils/ResponseUtils';
const bcrypt = require('bcrypt');

const apiKey: string = `${process.env.SMS_API_KEY}`;
const apiSecret: string = `${process.env.SMS_API_SECRET}`;

const accountApiCredentials: string = `${apiKey}:${apiSecret}`;

const buff: Buffer = Buffer.from(accountApiCredentials);
const base64Credentials: string = buff.toString('base64');

export default class UserController {

  static async createUser(req: Request, res: Response) {
    try {
      const decodedToken = CommonUtils.handleAuthHeader(req);
      if (decodedToken instanceof Response) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { name, surname, phone, email, idNum, user_role, password } = req.body;

      const role = user_role === "User" ? "Finance" : user_role;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user into the database
      await db.insert(users).values({
        name,
        surname,
        email,
        phone,
        idNum,
        status: "Inactive",
        password: hashedPassword,
        role: role,
      });

      //  ===== SMS OTP CODE ===== // 

      // Prepare to send an SMS notification
      // const requestData = JSON.stringify({
      //   messages: [{
      //     content: `Welcome to SlipSam \n Find Below your logins:\n Username: ${idNum} \n Password: ${passCode} \n Thank You \n Taxi Admin.co.za`,
      //     destination: `+27${phone?.replace(/^0/, '')}`,
      //   }],
      // });

      // console.log("Prepared requestData for SMS API:", requestData);

      // const response = await axios.post('https://rest.mymobileapi.com/bulkmessages', requestData, {
      //   headers: {
      //     'Authorization': `Basic ${base64Credentials}`,
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (response.data) {
      //   console.log("Success:", response.data);
      //   return res.status(200).json({ success: true, data: response.data });
      // }

      // ===== ===== //
      ResponseUtils.success(res, "User created successfully", req.body);
      
    } catch (error) {
      console.error('Error creating user:', error);
      ResponseUtils.error(res, "Error Creating User", error, req.body);
    }
  };

  static async ChangePassword(req: Request, res: Response) {
    try {
      const decodedToken = CommonUtils.handleAuthHeader(req);
      if (decodedToken instanceof Response) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { password, new_password } = req.body.formData;

      if (!password || !new_password) {
        return res.status(400).json({ error: "Both current and new passwords are required" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, decodedToken.id));

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const storedPassword = user.password;

      const isPasswordValid = await bcrypt.compare(password, storedPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid current password" });
      }

      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

      await db.update(users).set({ password: hashedNewPassword })
        .where(eq(users.id, decodedToken.id));

      return res.json({ message: 'Password changed successfully' });

    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ error: 'Server Error' });
    }
  };

  static async deleteUser(req: Request, res: Response) {
    try {
      const decodedToken = CommonUtils.handleAuthHeader(req);
      if (decodedToken instanceof Response) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.body;

      await db
        .delete(users)
        .where(eq(users.id, id));

      ResponseUtils.success(res, "User deleted successfully", req.body);
    } catch (error) {
      ResponseUtils.error(res, "Error Deleting User", error, req.body);
    }
  };


  static async updateUser(req: Request, res: Response) {
    try {
      const decodedToken = CommonUtils.handleAuthHeader(req);
      if (decodedToken instanceof Response) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { id, name, surname, phone, email, idNum, status } = req.body;

      await db
        .update(users)
        .set({
          name: name,
          surname: surname,
          email: email,
          phone: phone,
          idNum: idNum,
          status: status,
        })
        .where(and(eq(users.id, id)));

        ResponseUtils.success(res, "User updated successfully", req.body);

    } catch (error) {
      console.error('Error fetching users:', error);
      ResponseUtils.error(res, "Error Updating User", error, req.body);
      res.status(500).send('Server Error');
    }
  };


}
