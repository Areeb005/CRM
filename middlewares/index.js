const jwt = require('jsonwebtoken');
const User = require('../models/users_model');


const Auth = (req, res, next) => {
    try {

        // Check if the Authorization header exists in the request
        if (!req.headers || !req.headers.authorization) { return res.status(401).json({ error: "Authorization header is required" }); }

        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;

        // Split the header value to separate the token
        const token = authHeader.split(' ')[1]; // Assuming Bearer token is used

        // const token = req.cookies.access_token
        if (!token)
            return res.status(401).json({ error: "Incorrect Access Token" });

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err)
                return res.status(401).json({ error: "Invalid Authentication" });


            req.user = user
            const { id } = user

            // Find the user record based on the _id from the token
            try {
                const record = await User.findOne({ where: { id } })
                if (!record) 
                    return res.status(404).json({ error: "User does not exist" });


                if (!record.status)
                    return res.status(403).json({ error: "Account status is blocked" });

                next();
            } catch (err) {
                return res.status(500).json({ error: "An internal server error occurred. Please try again later" });
            }

        })
    } catch (err) {
        return res.status(500).json({ error: "An internal server error occurred. Please try again later" });
    }
}

const allowedUsers = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assuming `role` is set in `req.user` after authentication
      if (allowedRoles.includes(userRole)) {
        return next();
      }
      return res.status(403).json({ message: "Access denied" });
    };
};
  


module.exports = { Auth, allowedUsers }

