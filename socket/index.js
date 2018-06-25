import db from '../db.js';

const { Users, Messages, Sessions } = db().models;

module.exports = (app) => {
  let server = require('http').Server(app);
  let io = require('socket.io')(server);

  server.listen(process.env.PORT || 3001);

  io.on('connection', function (socket) {


    socket.on('authorization', function ({ userID, password }) {
      Users.findOne({where: {id: userID}})
        .then((user) => {
          if (user && user.password === password) {
            socket.join(`user${userID}`);
            user.dialogs.map(id => {
              socket.join(`dialog${id}`);
            });
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });

    socket.on('message', function (data) {
      console.log('data: ', data);
      Users.findOne({where: {id: data.userID}})
        .then((user) => {
          if (user && user.password === data.password) {
            Messages.create({
              author: data.message.author,
              message: data.message.message,
              dialogID: data.dialogID,
            })
              .then((result) => {
                io.in(`dialog${data.dialogID}`).emit('new message', {
                  dialogID: data.dialogID,
                  message: result.dataValues
                });
              });
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });

    socket.on('view', function (data) {
      Users.findOne({where: {id: data.userID}})
        .then((user) => {
          if (user && user.password === data.password) {
            socket.to(`dialog${data.dialogID}`).emit('new view', {
              dialogID: data.dialogID,
              messageID: data.messageID,
              userID: data.userID
            });

            Messages.findOne({where: {id: data.messageID}})
              .then((message) => {
                if (!message.viewedBy.some(vb => vb === data.userID)) {
                  Messages.update({viewedBy: message.viewedBy.concat(data.userID)}, {where: {id: data.messageID}});
                }
              });

          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });

    socket.on('typing start', function (data) {
      console.log('data: ', data);
      Users.findOne({where: {id: data.userID}})
        .then((user) => {
          if (user && user.password === data.password) {
            socket.to(`dialog${data.dialogID}`).emit('typing start', {dialogID: data.dialogID, userID: data.userID});
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });

    socket.on('typing end', function (data) {
      console.log('data: ', data);
      Users.findOne({where: {id: data.userID}})
        .then((user) => {
          if (user && user.password === data.password) {
            socket.to(`dialog${data.dialogID}`).emit('typing end', {dialogID: data.dialogID, userID: data.userID});
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });


  });
};
