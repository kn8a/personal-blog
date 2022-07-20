const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = asyncHandler(async (req,res,next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //get token from header, formated like ('Bearer tokenstartshere')
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //get user from token                     exclude password field
            req.user = await User.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            
            res.status(401).json({
                message: 'user not authorized'
            }) //401 - not authorized
            return
            
        }
    }

    if(!token) {
        next()
    }
    
})

module.exports = { protect }