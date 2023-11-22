const Product = require('../models/Product');
const Cart = require('../models/Cart');

module.exports = {
    addToCart: async (req, res) => {
        const { userId, cartItem, quantity } = req.body
        try {
            const cart = await Cart.findOne({ userId })
            if (cart) {
                const existingProduct = cart.find((product) => product.cartItem.toString() === cartItem)
                if (existingProduct) {
                    existingProduct.quantity += 1
                } else {
                    cart.products.push({ cartItem, quantity })

                }

                await cart.save();
                res.status(200).json("Product added to Cart")
            }
            else {
                const newCart = new Cart({
                    userId, products: [{
                        cartItem, quantity: quantity
                    }],
                })
                await newCart.save()
                res.status(200).json("Product added to cart")
            }
        } catch (err) {

            res.status(500).json(err)
        }
    },
    getCart: async (req, res) => {
        const userId = req.param.id;
        try {
            const cart = await Cart.find({ userId }).populate('products.cartItem', "_id title imageUrl price supplier")
            res.status(200).json(cart)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    delteCartItem: async (req, res) => {
        // const { userId, cartItem, } = req.body
        const cartItemId = req.param.cartItemId;
        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { 'products_id': cartItemId },
                { $pull: { products: { _id: cartItemId } } },
                { new: true }
            )
        } catch (err) { }
    },
    decrementCart: async (req, res) => {
        const { userId, cartItem, } = req.body
        try {
            const cart = Cart.findOne({ userId })
            if (!cart) {
                return res.status(404).json("Cart Not Found")
            }
            const existingProduct = cart.products.find((product) => product.cartItem.toString() === cartItem)
            if (!existingProduct) {
                return res.status(404).json("Product Not Found")
            }
            if (!existingProduct.quantity === 1) {
                cart.products = cart.products.filter((product) => product.cartItem.toString() !== cartItem)
                //return res.status(404).json("Product Not Found")
            }
            else {
                existingProduct.quantity -= 1;
            }
            await cart.save()
            if (existingProduct === 0) {
                await Cart.updateOne(
                    { userId },
                    { $pull: { products: { cartItem } } }
                )
            }
            res.status(200).json("Product updated")
        } catch (err) {

            res.status(500).json("Product Error")
        }
    }
}