import db from '../db.js';
import { reformatUser } from '../functions';

const { Users, Dialogs, Messages, DialogsParticipants } = db().models;

module.exports = {
  get(req, res) {
    Users.findOne({ where: { id: +req.query.userID } })
      .then((user) => {
        if (user.password === req.query.password) {
          DialogsParticipants.findAll({
            where: { userID: +req.query.userID, isActive: true },
            limit: +req.query.limit,
            offset: +req.query.offset,
            order: [[ 'id', 'DESC' ]],
            include: [
              {
                model: Dialogs,
                include: [
                  {
                    model: Messages,
                    limit: 1,
                    order: [[ 'id', 'DESC' ]]
                  },
                  {
                    model: DialogsParticipants,
                    include: [{ model: Users }]
                  }
                ]
              }
            ],
          })
            .then((dialogsParticipants) => {
              res.send(dialogsParticipants.map(dp => ({
                id: dp.Dialog.id,
                name: dp.Dialog.name,
                creator: dp.Dialog.creator,
                participants: dp.Dialog.DialogsParticipants
                  .map(dp => dp.User)
                  .filter(u => u.id !== +req.query.userID),
                usersWhoLeft: dp.Dialog.DialogsParticipants
                  .filter(dp => dp.User.id !== +req.query.userID && !dp.isActive)
                  .map(dp => dp.User.id),
                messages: dp.Dialog.Messages,
              })))
            });
        } else {
          throw Error('Wrong username or password');
        }
      })
      .catch((error) => {
        res.status(412).json({msg: error.message});
      });
  },
  post(req, res) {
    Users.findOne({ where: { id: req.body.userID } })
      .then((user) => {
        if (user.password === req.body.password) {
          Dialogs.create({
            name: req.body.name,
            creator: req.body.userID,
          })
            .then((dialog) => {
              req.body.participants.map(p => {
                Users.findOne({ where: { id: p } })
                  .then(u => {
                    if (u) {
                      DialogsParticipants.create({
                        dialogID: dialog.dataValues.id,
                        userID: u.id
                      })
                    } else {
                      res.sendStatus(404);
                    }
                  })
                  .catch(error => {
                    res.status(412).json({msg: error.message});
                  });
              });

              Users.findAll({ where: { id: req.body.participants } })
                .then((users) => {
                  res.send({
                    id: dialog.dataValues.id,
                    name: req.body.name,
                    creator: req.body.userID,
                    participants: users,
                    messages: [],
                  });
                  res.sendStatus(200);
                })
                .catch((error) => {
                  res.status(412).json({msg: error.message});
                });
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
  },
  delete(req, res) {
    Users.findOne({ where: { id: req.body.userID } })
      .then((user) => {
        if (user.password === req.body.password) {
          DialogsParticipants.findOne({ where: { dialogID: req.body.dialogID, userID: req.body.userID } })
            .then((isParticipant) => {
              if (isParticipant) {
                DialogsParticipants.findAll({ where: { dialogID: req.body.dialogID } })
                  .then((dp) => {
                    if (dp.length >= 2) {
                      DialogsParticipants.update({
                        isActive: false
                      },{
                        where: {userID: req.body.userID, dialogID: req.body.dialogID}
                      })
                    } else {
                      Dialogs.destroy({ where: { id: req.body.dialogID } })
                    }
                  });
              } else {
                throw Error('Not a participant');
              }
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