const Favourites = require("../models/Favourites");

module.exports = {
    createFavourites: async (req, res) => {
        const newFav = new Favourites(req.body)
        try {
            await newFav.save()
            res.status(200).json({ message: "Data Saved Successfully" })
        } catch (err) {
            res.status(500).json({ message: "Error", Error: err })
        }
    },
    getAllFavourites: async (req, res) => {

        try {
            const FavData = await Favourites.find().sort({ createAt: -1 })
            res.status(200).json({ message: "Data Retrived", data: FavData })
        } catch (err) {
            res.status(500).json({ message: "Error", Error: err })
        }
    }
}