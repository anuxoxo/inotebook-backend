const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "imgood";
const fetchUser = require('../middleware/fetchUser')

router.post('/register',
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({
                    msg: "Already registered!",
                })
            }

            const salt = bcrypt.genSaltSync(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id,
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            console.log(authToken);

            res.json(user);
        }
        catch {
            res.json({ errors: "some error occurred!" });
        }

    });

router.post('/login',
    body('email').isEmail(),
    body('password', 'Password cannot be blank').exists(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({
                    msg: "Please enter correct credentials!",
                })
            } else {
                const passwordCompare = await bcrypt.compare(req.body.password, user.password);
                if (!passwordCompare) {
                    return res.status(400).json({
                        msg: "Please enter correct credentials!",
                    })
                }
                const data = {
                    user: {
                        id: user.id,
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);
                res.json({ authToken });
            }
        }
        catch (err) {
            console.log(err.message);
            res.json({ errors: "some error occurred!" });
        }

    });

router.post('/getuser', fetchUser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(err.message);
        res.json({ errors: "some error occurred!" });
    }
})

module.exports = router;