import db from '../db.js';

const { DialogsParticipants } = db().models;

module.exports = {
  post(req, res) {
    DialogsParticipants.create({
      userID: req.body.userID,
      dialogID: req.body.dialogID,
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