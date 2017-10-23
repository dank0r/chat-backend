import db from '../db.js';
import { besides } from '../functions';

const { Users, Sessions } = db().models;

module.exports = {
  post(req, res) {
    Users.findOne({
      where: { username: req.body.username },
      include: [{ model: Sessions }]
    })
      .then((user) => {
        if (user && user.password === req.body.password) {
          if (!user.Session) {
            Sessions.create({userID: user.dataValues.id})
              .then((session) => {
                res.send({
                  id: user.id,
                  username: user.username,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  password: user.password,  //!!!
                  posts: user.posts,
                  friends: user.friends,
                  subscribers: user.subscribers,
                  subscriptions: user.subscriptions,
                  isOnline: user.isOnline,
                  status: user.status,
                  session: session.uuid,
                });
                res.sendStatus(200);
              })
              .catch((error) => {
                res.status(412).json({msg: error.message});
              });
          } else {
            res.send({
              id: user.id,
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              password: user.password, //!!!
              posts: user.posts,
              friends: user.friends,
              subscribers: user.subscribers,
              subscriptions: user.subscriptions,
              isOnline: user.isOnline,
              status: user.status,
              session: user.Session.uuid,
            });
            res.sendStatus(200);
          }
        } else {
          throw Error('Wrong username or password');
        }
      })
      .catch((error) => {
        res.status(412).json({msg: error.message});
      });
  }
};