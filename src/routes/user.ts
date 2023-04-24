import express from 'express';
import db_knex from '../db/index_knex.js';
import {
  dbErrorHandler,
  requestErrorHandler,
  successHandler,
  validationErrorHandler,
} from '../responseHandler/index.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({});

const user = express.Router();

user.post('/', (req, res) => {
  db_knex
    .insert(req.body)
    .into('User')
    .then((idArray) => {
      successHandler(req, res, idArray, 'Adding user success');
    })
    .catch((error) => {
      if (error.errno === 1062 || error.errno === 1169) {
        requestErrorHandler(
          req,
          res,
          `User with that email ${req.body.email} already exists`,
        );
      } else {
        dbErrorHandler(req, res, error, 'Some DB error while adding user');
      }
    });
});

user.get('/:email', (req, res) => {
  db_knex('User')
    .select('email', 'isAdmin', 'isPlanner', 'isStatist')
    .where('email', req.params.email)
    .then((data) => {
      console.log(data);
      const token = jsonwebtoken.sign(
        {
          email: data[0].email,
          isAdmin: data[0].isAdmin,
          isPlanner: data[0].isPlanner,
          isStatist: data[0].isStatist,
        },
        process.env.SECRET_TOKEN as string,
        { expiresIn: '24h' },
      );
      const updatedData = data.map((obj) => ({ ...obj, token }));
      successHandler(req, res, updatedData, 'Ok');
    })
    .catch((err) => {
      requestErrorHandler(req, res, `${err} Oops! Nothing came through - User`);
    });
});

export default user;