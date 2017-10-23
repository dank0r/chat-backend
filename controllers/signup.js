import db from '../db.js';
const { Users } = db().models;

module.exports = {
  post(req, res) {
    Users.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    })
      .then(result => {
        res.send(result.dataValues);
        res.sendStatus(200);
      })
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
  }
};