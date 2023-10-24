const express = require('express');
const router = express.Router();
const registerUser = require('../register');
const updateUserAttributes = require('../editUser');
const userUtils = require('../user');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
// const { authMiddleware, isAdmin } = require('../routes')

router.use(cors());

const authMiddleware = (req, res, next) => {
  const token = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;

  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  jwt.verify(token, '123456789', (err, data) => {
    if (err) {
      console.log(token);
      return res.json({ err }); // forbidden
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
    res.json({ msg: 'hi' });
  }
};

router.post('/registerUser', async (req, res) => {
  console.log('Register User!!!');
  console.log(req.body);

  let userName = req.body.userName;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let hashedPassword = await userUtils.encryptPassword(password);
  let user = await userUtils.getUserById(userName);
  console.log(user);
  if (user) {
    return res.sendStatus(409);
  }

  res.json(await registerUser({ userName, name, email, hashedPassword }));
});

router.post('/login', async (req, res) => {
  console.log('login');
  console.log(req.body);

  let username = req.body.username;
  let password = req.body.password;
  let user = await userUtils.getUserById(username);

  if (!user) {
    return res.sendStatus(404); // user doesn't exist
  }

  const hashedPassword = await userUtils.getUserHashedPassword(username);
  const isPasswordMatch = await userUtils.comparePasswords(password, hashedPassword);
  if (!isPasswordMatch) {
    console.log('incorrect password');
    return res.sendStatus(404);
  }

  let userJson = { userId: username };

  try {
    let accessToken = jwt.sign(userJson, '123456789', {
      expiresIn: '30m'
    });

    let refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Error signing the token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refresh-access-token', (req, res) => {
  const { refreshToken } = req.body;
  // if(!refreshTokens.includes(refreshToken)){
  //     return res.sendStatus(403)
  // }
  console.log(refreshToken);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log('error in refresh access token');
      return res.sendStatus(403);
    }

    console.log('no error in refresh access token');

    const userJson = {
      userId: data.userId
    };
    let newAccessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m'
    });
    res.json({ accessToken: newAccessToken, refreshToken: refreshToken });
  });
});

router.post('/access-token', (req, res) => {
  const { accessToken } = req.body;

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(403); // unauthorized
    }
    req.user = data;
    res.json(accessToken);
  });
});

router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(403); // unauthorized
    }
    req.user = data;
    // next()
    res.json(refreshToken);
  });
});

router.get('/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();

  res.json({ csrfToken });
});

module.exports = router;
