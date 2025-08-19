const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        if (!name || !email || !password){
            return res.status(400).json({ success:false, message: "All fields are required"});
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ success: false, message: "Email already registered"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch(error){
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ success: false, message: "Invalid credentials"});
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    }
    catch(error){
        res.status(500).json({ success: false, message: "Server error", error: error.message});
    }
};




