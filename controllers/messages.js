import db from '../db.js';

const { Users, Messages } = db().models;

module.exports = {
  get(req, res) {
    Users.findOne({ where: { id: +req.query.userID } })
      .then((user) => {
        if (user.password === req.query.password) {
          Messages.findAll({
            limit: +req.query.limit,
            offset: +req.query.offset,
            where: { dialogID: +req.query.dialogID },
            order: [[ 'id', 'DESC' ]],
          })
            .then((messages) => {
              res.send({
                dialogID: +req.query.dialogID,
                messages
              });
              res.sendStatus(200);
            })
            .catch((error) => {
              res.status(412).json({msg: error.message});
            });
        } else {
          throw Error('Wrong username or password');
        }
      })
      .catch((error) => {
        res.status(412).json({msg: error.message});
      });
  }
};