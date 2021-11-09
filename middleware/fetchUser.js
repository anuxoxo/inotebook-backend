var jwt = require('jsonwebtoken');
const JWT_SECRET = "imgood";

const fetchUser = (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;

        next();
    } catch (error) {
        res.send(401).send({ error: "Please authenticate using a valid token" });
    }

}

module.exports = fetchUser;