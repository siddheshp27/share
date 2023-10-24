const express = require('express');
const router = express.Router();
const userUtils = require('../user');
const { putCid, getCids, getCid } = require('../queryLeadger');
var eccrypto = require('eccrypto');
var privateKeyB = eccrypto.generatePrivate();
var publicKeyB = eccrypto.getPublic(privateKeyB);
const jwt = require('jsonwebtoken');
// const { authMiddleware } = require('../routes');

// const csrfDSC = require("express-csrf-double-submit-cookie");

// const csrfProtection = csrfDSC();

const authMiddleware = (req, res, next) => {
  const token = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.sendStatus(403); // forbidden
    }

    req.user = data;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const userRole = await userUtils.getUserRole(req.user.userId);
  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).send();
  }
};

router.post('/putCid', async (req, res) => {
  const data = req.body.bin;
  const user = req.body.user;
  const response = await putCid(user, data);
  res.json(response);
});
router.post('/getCid', async (req, res) => {
  const user = req.body.user;
  const data = await getCids(user);

  res.json(data);
});
router.post('/get', async (req, res) => {
  // const cid = req.params.cid;
  // const currentUserId = req.params.currentUserId
  // const currentUserId = req.query.currentUserId;
  // const user = req.body.user;
  const data = await getCid('sid');

  res.json(data);
});

module.exports = router;
