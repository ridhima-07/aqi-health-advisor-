import bcrypt from "bcrypt";
import { getUserByEmail } from "../queries/users.js";

export async function login ( req, res )
{
    try {
        const {email, password} = req.body;

        if (!email || !password) 
            return res.status(400).json({ success: false, message: "Email and password are required."});

        const user = await getUserByEmail ( email );
        if (!user) 
            return res.status(404).json({success: false, message: "User not found."});

        const isMatch = await bcrypt.compare( password, user.password );

        if ( !isMatch )
            return res.status(401).json({success: false, message: "Invalid credentials!"});

        return res.status(200).json({success: true, message: "User logged in successfully!", data: {id: user.id}});

    } catch ( error ){
        return res.status(500).json({success: false, message: "User could not be logged in."});
    }
};