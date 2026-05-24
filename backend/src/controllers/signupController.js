import bcrypt from "bcrypt";
import { getUserByEmail, createAuthUser } from "../queries/users.js";

export async function signup ( req, res )
{
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) 
            return res.status(400).json({ success: false, message: "Name, email, and password are required." });

        const existingUser = await getUserByEmail(email);

        if (existingUser) 
            return res.status(400).json({ success: false, message: "User already exists with this email."});

        const hash = await bcrypt.hash(password, 10);
        const newUser = await createAuthUser ( name, email, hash );

        return res.status(201).json({ success: true, message: "User signed up successfully.", data: { id: newUser.insertId } });
    }
    catch {
        return res.status(500).json({success: false, message: "Could not sign up user."});
  }
};