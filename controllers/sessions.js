import db from '../db.js';

const { Sessions } = db().models;

module.exports = {
  delete(req, res) {
    Sessions.destroy({
      where: {
        id: req.body.id,
      }})
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
  }
};