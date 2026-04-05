import {
    createUser,
    updateUser,
    getUsers,
    getUserByID,
    getUserByEmail,
    deleteUserByID
} from "../queries/users.js";

export async function registerUser(req, res) {
    try {
        const {name, dob, email, gender} = req.body;
        if ( !name || !dob || !email || !gender )
            return res.status(400).json({success: false, message: "Details incomplete."});
        const newUser = await createUser(name, dob, email, gender);
        if (!newUser)
            return res.status(400).json({ success: false, message: "Failed to create user."});
        res.status(201).json({ success: true, message: "User created successfully!", data: {id: newUser.insertId}});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create user."});
    }
};

export async function updateUserController (req, res)
{
    try {
        const id = req.params.id;
        const {name, dob, email, gender} = req.body;
        const updatedUser = await updateUser(id, name, dob, email, gender);
        if (updatedUser.affectedRows===0)
            return res.status(404).json({ success: false, message: "User not found."});
        res.status(200).json({ success: true, message: "User updated successfully!"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update user."});
    }
};

export async function getAllUsers(req,res)
{
    try {
        const users = await getUsers();
        res.status(200).json({ success: true, data: users});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users."});
    }
};

export async function getUserByIdController (req, res) 
{
    try {
        const id = req.params.id;
        const user = await getUserByID (id);
        if (!user) 
            return res.status(404).json({ success: false, message: "User not found."});
        res.status(200).json({ success: true, data: user});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user"});
    }
};

export async function getUserByEmailController (req, res) 
{
    try {
        const email = req.params.email;
        const user = await getUserByEmail (email);
        if (!user) 
            return res.status(404).json({ success: false, message: "User not found."});
        res.status(200).json({ success: true, data: user});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user"});
    }
};

export async function deleteUser(req, res) 
{
    try {
        const id = req.params.id;
        const user = await deleteUserByID(id);
        if ( user.affectedRows === 0 )
            return res.status(404).json({ success: false, message: "User not found"});
        res.status(200).json({ success: true, message: "User deleted successfully!"});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete user."});
    }
}