import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/drizzle.config";
import dotenv from "dotenv";
import { eq } from 'drizzle-orm';
import ResponseUtils from "../utils/ResponseUtils";
import { users } from "../db/schemas/UserSchema";
import CommonUtils from "../utils/CommonUtils";
import { or } from "drizzle-orm";
import { user_address } from "../db/schemas/UserAddressSchema";
import { opt_codes } from "../db/schemas/OtpCodesSchema";
import { user_company } from "../db/schemas/UserCompanySchema";
const bcrypt = require('bcrypt');

dotenv.config();

export default class AuthController {

  static generateAccessToken(payload: any) {
    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET is not defined');
      throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.JWT_SECRET);
 }

 static async login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    ResponseUtils.error(res, "Username and password are required", {}, req.body, 400);
    return;
  }

  try {
    // Check either email or phone
    const user = await db
      .select()
      .from(users)
      .where(or(eq(users.email, username.toLowerCase()), eq(users.phone, username)))
      .limit(1);

    if (user.length === 0) {
      console.log('User not found');
      ResponseUtils.error(res, "Invalid credentials", req.body, 401);
      return;
    }

    const userRecord = user[0];

    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      ResponseUtils.error(res, "Invalid credentials", req.body, 401);
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.log('JWT_SECRET is not defined');
      throw new Error('JWT_SECRET is not defined');
    };

    // Generate JWT token
    const accessToken = AuthController.generateAccessToken({
      id: userRecord.id,
      name: userRecord.name,
      surname: userRecord.surname,
      email: userRecord?.email,
      role: userRecord.role,
    });

    ResponseUtils.success(res, "User logged in successfully", {accessToken});

  } catch (error) {
    console.error('Error fetching user:', error);
    ResponseUtils.error(res, "Error Logging In", error, req.body, 500);
  }
}


  static async RegisterUser(req: Request, res: Response) {
    try {
      const { 
        name, 
        surname, 
        phone, 
        email, 
        idNum, 
        role, 
        password, 
        street, 
        country, 
        city, 
        postal_code,
        company_name,
        registration_no,
      } = req.body;
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert the user into the database
      const response: any = await db.insert(users).values({
        name,
        surname,
        email: email.toLowerCase(),
        phone,
        idNum,
        status: "Inactive",
        password: hashedPassword,
        role: 'user',
      });

      const insertId = response[0].insertId

      // STEP 2 ADD USER ADDRESS
      try {
        await db.insert(user_address).values({
          street,
          user_id: insertId,
          country,
          city,
          postal_code,
        });
      } catch (error) {
        ResponseUtils.error(res, "Error Creating User Address", error, req.body);
        await db.delete(users).where(eq(users.id, insertId));
      };

      // STEP 4 IF COMPANY DETAILS, ADD COMPANY
      try {
        if (company_name && registration_no) {
          await db.insert(user_company).values({
            user_id: insertId,
            name: company_name,
            registration_no,
          });
        }
      } catch (error) {
        ResponseUtils.error(res, "Error Creating Company", error, req.body);
        await db.delete(users).where(eq(users.id, insertId));
      }

      // STEP 4 ADD USER ADDRESS
      try {
        await db.insert(opt_codes).values({
          user_id: insertId,
          code: CommonUtils.generateOTP(),
        });
      } catch (error) {
        ResponseUtils.error(res, "Error Creating OTP", error, req.body);
        await db.delete(users).where(eq(users.id, insertId));
      }
      ResponseUtils.success(res, "User created successfully", { user_id: insertId });
      
    } catch (error) {
      console.error('Error creating user:', error);
      ResponseUtils.error(res, "Error Creating User", error, req.body);
    }
  };

  static async VerifyUser(req: Request, res: Response) {
    const { otp, user_id } = req.body;
  
    if (!otp || !user_id) {
      ResponseUtils.error(res, "OTP and Password are required", {}, req.body, 400);
      return;
    }
  
    try {
      // Check either email or phone
      const otpCheck = await db
        .select()
        .from(opt_codes)
        .where(or(eq(opt_codes.user_id, user_id), eq(opt_codes.code, otp)))
        .limit(1);
  
      if (otpCheck.length === 0) {
        console.log('Invalid Code');
        ResponseUtils.error(res, "Invalid credentials", req.body, 401);
        return;
      };

      if (otpCheck[0].user_id !== user_id) {
        console.log('Invalid User');
        ResponseUtils.error(res, "Invalid credentials", req.body, 401);
        return;
      };

      if (otpCheck[0].code === otp) {
        await db.delete(opt_codes).where(eq(opt_codes.user_id, user_id));
        await db.update(users).set({ status: "Active" }).where(eq(users.id, user_id));
        ResponseUtils.success(res, "User verified successfully", req.body);
      }

  
    } catch (error) {
      console.error('Error fetching user:', error);
      ResponseUtils.error(res, "Error Logging In", error, req.body, 500);
    }
  }

}

