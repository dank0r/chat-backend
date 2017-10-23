import db from '../db.js';
import { besides } from '../functions';

const { Users, Sessions } = db().models;

module.exports = {
  get(req, res) {
    Sessions.findOne({
      where: { uuid: req.query.session },
      include: [{ model: Users }]
    })
      .then((session) => {
          if (session) {
            res.send({
              id: session.User.id,
              username: session.User.username,
              firstname: session.User.firstname,
              lastname: session.User.lastname,
              password: session.User.password, //!!!
              posts: session.User.posts,
              friends: session.User.friends,
              subscribers: session.User.subscribers,
              subscriptions: session.User.subscriptions,
              isOnline: session.User.isOnline,
              status: session.User.status,
              session: session.uuid,
            });
            res.sendStatus(200);
          }
      })
      .catch((error) => {
        res.status(412).json({msg: error.message});
      });
  }
};