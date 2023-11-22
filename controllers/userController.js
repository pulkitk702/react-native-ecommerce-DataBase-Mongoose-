const User = require("../models/User");
module.exports = {
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Successfully Deleted")
        } catch (err) {
            res.status(500).json({ message: "Erorr", Error: err })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(401).json("User Does Not Exist")

            }
            const { password, __v, createAt, updatedAt, ...userData } = user._doc;
            res.status(200).json({ message: "UserData", data: userData })

        } catch (err) {
            res.status(500).json("Error", err)

        }
    }
}