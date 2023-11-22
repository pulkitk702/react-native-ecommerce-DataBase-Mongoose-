const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
module.exports = {
    createUser: async (req, res) => {
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            location: req.body.location,
            password: CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET
            ).toString(),
        });
        try {
            await newUser.save();
            res.status(201).json({ message: "User Successfully Created" });
        } catch (err) {
            res.status(500).json({ message: "Erro", err });
        }
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(401).json({ message: "Wrong Credentials provide a valid email" });

            }

            const decryptedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.SECRET
            )
            const decryptpass = decryptedPassword.toString(CryptoJS.enc.Utf8);

            if (decryptpass != req.body.password) {
                return res.status(401).json({ message: "Wrong Password" });
            }
            const userToken = jwt.sign({
                id: user.id
            }, process.env.JWT_SEC, { expiresIn: "7d" })

            const { password, __v, createdAt, updatedAt, ...userData } = user._doc;
            res.status(200).json({ ...userData, token: userToken });
        } catch (err) {
            res.status(500).json({ message: "Erro", err });
        }
    },
};
