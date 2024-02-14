/**
 * Author: Julian Schuster, Jörg Adelhelm
 * Middleware zum validieren von Register und Login
 */

const jwt = require('jsonwebtoken')
const regex = /\.hs-fulda\.de$/gm

module.exports = {
  validateRegister: (req, res, next) => {
    console.log(req.body)
    // username min length 3
    if (!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({
        msg: 'Please enter a username with min. 3 chars',
      })
    }
    // password min 6 chars
    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars',
      })
    }
    // password (repeat) does not match
    if (
      !req.body.password_repeat ||
      req.body.password != req.body.password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match',
      })
    }

    // Regex Logik - Email
    if (req.body.email.match(regex) == null) {
      return res.status(400).send({
        msg: 'Please enter a valid university mail',
      })
    }
    next()
  },
  // LOGIN schützen
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, 'SECRETKEY')
      req.userData = decoded
      next()
    } catch (err) {
      return res.status(401).send({
        msg: 'Your session is not valid!',
      })
    }
  }
}