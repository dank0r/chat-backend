import db from '../db.js';

const { Users, Posts, Sessions } = db().models;

module.exports = {
  get(req, res) {
    Posts.findAll({
      where: { author: +req.query.author },
      limit: +req.query.limit,
      offset: +req.query.offset,
      order: [[ 'id', 'DESC' ]],
    })
      .then((posts) => {
        res.send(posts);
        res.sendStatus(200);
      });
  },
  post(req, res) {
    Sessions.findOne({
      where: { uuid: req.body.session },
      include: [{ model: Users }]
    })
      .then((session) => {
        if (session && session.User.id === req.body.userID) {
          Posts.create({
            text: req.body.text,
            author: req.body.userID,
          })
            .then((post) => {
              res.send(post.dataValues);
              res.sendStatus(200);
            })
            .catch((error) => {
              res.status(412).json({msg: error.message});
            });
        } else {
          throw Error('Invalid session');
        }
      })
      .catch((error) => {
        res.status(412).json({msg: error.message});
      });
  }
};