import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered, please login!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User successfully registered!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered, please register first!",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "User successfully logged in!",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};