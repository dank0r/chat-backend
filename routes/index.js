module.exports = function(app) {

  const Users = app.db.models.Users;
  const Dialogs = app.db.models.Dialogs;
  const Messages = app.db.models.Messages;
  const Posts = app.db.models.Posts;

  const reformatUser = (u) => ({
    id: u.id,
    username: u.username,
    firstname: u.firstname,
    lastname: u.lastname,
    posts: u.posts,
    friends: u.friends,
    subscribers: u.subscribers,
    subscriptions: u.subscriptions,
    isOnline: u.isOnline,
    status: u.status,
  });

  const compareRandom = (a, b) => {
    return Math.random() - 0.5;
  };



  let server = require('http').Server(app);
  let io = require('socket.io')(server);

  server.listen(3001);

  io.on('connection', function(socket){


    socket.on('authorization', function({ userID, password }){
      Users.findOne({ where: { id: userID } })
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

    socket.on('message', function(data){
      console.log('data: ', data);
      //io.emit('new message', {dialogID: data.dialogID, message: data.message});
      Users.findOne({ where: { id: data.userID } })
        .then((user) => {
          if (user && user.password === data.password) {

            //io.emit('new message', {dialogID: data.dialogID, message: data.message});
            /*Dialogs.findOne({ where: { id: data.dialogID } })
              .then((dialog) => {
                //Dialogs.update({ messages: dialog.messages.concat(data.message) }, { where: { id: data.dialogID } })

              })*/
            Messages.create({
              author: data.message.author,
              message: data.message.message,
              dialogID: data.dialogID,
            })
              .then((result) => {
                io.in(`dialog${data.dialogID}`).emit('new message', {dialogID: data.dialogID, message: result.dataValues});
              });
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });

    socket.on('view', function(data) {
      Users.findOne({ where: { id: data.userID } })
        .then((user) => {
          if (user && user.password === data.password) {
            socket.to(`dialog${data.dialogID}`).emit('new view', { dialogID: data.dialogID, messageID: data.messageID, userID: data.userID });

            Messages.findOne({ where: { id: data.messageID } })
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

    socket.on('typing start', function(data){
      console.log('data: ', data);
      Users.findOne({ where: { id: data.userID } })
        .then((user) => {
          if (user && user.password === data.password) {
            socket.to(`dialog${data.dialogID}`).emit('typing start', { dialogID: data.dialogID, userID: data.userID });
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });

    socket.on('typing end', function(data){
      console.log('data: ', data);
      Users.findOne({ where: { id: data.userID } })
        .then((user) => {
          if (user && user.password === data.password) {
            socket.to(`dialog${data.dialogID}`).emit('typing end', { dialogID: data.dialogID, userID: data.userID });
          } else {
            socket.to(socket.id).emit('authorization', 'Authorization failed');
          }
        })
        .catch((error) => {
          socket.to(socket.id).emit('authorization', error);
        });
    });



  });


  app.route('/login')
    .post((req,res) => {
        Users.findOne({ where: { username: req.body.username } })
        .then((user) => {
          if (user && user.password === req.body.password) {
            //res.send(Object.assign({}, user.dataValues, { password: null }));
            res.send(user.dataValues);
            res.sendStatus(200);
          } else {
            throw Error('Wrong username or password');
          }
        })
          .catch((error) => {
            res.status(412).json({msg: error.message});
          });

    });

  app.route('/signup')
    .post((req,res) => {
      Users.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
      })
        .then(result => {
          console.log('result.dataValues: ', result.dataValues);
          //res.send(Object.assign({}, result.dataValues, { password: null }));
          res.send(result.dataValues);
          res.sendStatus(200);
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });

    });

  app.route('/users')
    .get((req,res) => {
      Users.findAll({}).then((users) => {
        res.send(users.map(u => reformatUser(u)));
        res.sendStatus(200);
      });
    })
    .post((req,res) => {
        Users.findAll({ where: { id: req.body.query } })
          .then((users) => {
            res.send(users.map(u => reformatUser(u)));
            res.sendStatus(200);
          });

    });

  app.route('/users/random')
    .post((req,res) => {
      Users.findAll({})
        .then((users) => {
          let randomUsers = users.slice();
          res.send(randomUsers.sort(compareRandom).filter(u => u.id !== req.body.besides).slice(0, req.body.amount).map(u => reformatUser(u)));
          res.sendStatus(200);
        });

    });


  app.route('/posts')
    .get((req,res) => {
      Posts.findAll({})
        .then((posts) => {
          res.send(posts);
          res.sendStatus(200);
        })
        .catch((error) => {
          res.status(412).json({msg: error.message});
        });

    })
    .post((req,res) => {
      Posts.findAll({ where: { id: req.body.query } })
        .then((posts) => {
          res.send(posts);
          res.sendStatus(200);
        });

    });

  app.route('/posts/create')
    .post((req,res) => {
      Users.findOne({ where: { id: req.body.userID } })
        .then((user) => {
          if (user.password === req.body.password) {
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
            throw Error('Wrong username or password');
          }
        })
        .catch((error) => {
          res.status(412).json({msg: error.message});
        });
    });

  app.route('/dialogs')
    .get((req,res) => {
      Dialogs.findAll({})
        .then((dialogs) => {
          res.send(dialogs);
          res.sendStatus(200);
        })
        .catch((error) => {
          res.status(412).json({msg: error.message});
        });

    })
    .post((req,res) => {
      Dialogs.findAll({ where: { id: req.body.query } })
        .then((dialogs) => {
          Users.findOne({ where: { id: req.body.userID } })
            .then((user) => {
              if (user.password === req.body.password) {
                Messages.findAll({
                  limit: req.body.query.length,
                  order: [[ 'id', 'DESC' ]],
                  where: { dialogID: req.body.query },
                })
                  .then((messages) => {
                    res.send(dialogs.filter(d => d.dataValues.participants.some(p => p === req.body.userID)).map(d => {
                      console.log('messages: ', Object.assign({}, d, { messages: messages.filter(m => m.dialogID === d.id) }));
                      return Object.assign({}, d.dataValues, { messages: messages.filter(m => m.dialogID === d.id) });
                    }));
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
        })
        .catch((error) => {
          res.status(412).json({msg: error.message});
        });

    });

  app.route('/dialogs/create')
    .post((req,res) => {
      Users.findOne({ where: { id: req.body.userID } })
        .then((user) => {
          if (user.password === req.body.password) {
            Dialogs.create({
              name: req.body.name,
              participants: req.body.participants,
              creator: req.body.userID,
            })
              .then((dialog) => {
                req.body.participants.map(p => {
                  Users.findOne({ where: { id: p } })
                    .then(user => {
                      if (user) {
                        Users.update({
                          dialogs: user.dialogs.concat(dialog.dataValues.id),
                        }, { where: { id: p } });
                      } else {
                        res.sendStatus(404);
                      }
                    })
                    .catch(error => {
                      res.status(412).json({msg: error.message});
                    });
                });
                res.send(dialog.dataValues);
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
    });


  app.route('/dialogs/remove')
    .delete((req,res) => {
      Users.findOne({ where: { id: req.body.userID } })
        .then((user) => {
          if (user.password === req.body.password) {
            Users.update({ dialogs: user.dialogs.filter(d => d !== req.body.dialogID) },
              { where: { id: req.body.userID } });
            Dialogs.findOne({ where: { id: req.body.dialogID } })
              .then((dialog) => {
                if (dialog.participants.filter(p => p !== req.body.userID).length !== 0) {
                  Dialogs.update({participants: dialog.participants.filter(p => p !== req.body.userID)}, {where: {id: req.body.dialogID}})
                    .then(() => {
                      res.send({});
                      res.sendStatus(200);
                    })
                    .catch((error) => {
                      res.status(412).json({msg: error.message});
                    });
                } else {
                  Dialogs.destroy({ where: { id: req.body.dialogID } })
                    .then(() => {
                      Messages.destroy({ where: { dialogID: req.body.dialogID } })
                        .then(() => {
                          res.send({});
                          res.sendStatus(200);
                        })
                    })
                    .catch((error) => {
                      res.status(412).json({msg: error.message});
                    });
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
    });

  app.route('/messages')
    .get((req,res) => {
      Messages.findAll({})
        .then((messages) => {
          res.send(messages);
          res.sendStatus(200);
        })
        .catch((error) => {
          res.status(412).json({msg: error.message});
        });
    })
    .post((req,res) => {
      Users.findOne({ where: { id: req.body.userID } })
        .then((user) => {
          if (user.password === req.body.password) {
            Messages.findAll({
              limit: req.body.limit,
              offset: req.body.offset,
              where: { dialogID: req.body.dialogID },
              order: [[ 'id', 'DESC' ]],
            })
              .then((messages) => {
                res.send({
                  dialogID: req.body.dialogID,
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
    });



};