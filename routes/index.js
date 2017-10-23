import controllers from '../controllers';

module.exports = function(app) {

  Object.keys(controllers).map((controller) => {
    Object.keys(controllers[controller]).filter(m => m !== 'name').map((method) => {
      app.route(`/${controllers[controller].name || controller}`)[method](controllers[controller][method]);
    });
  });

/*
  app.route('/authorization')
    .get(controllers.authorization.get);

  app.route('/login')
    .post(controllers.login.post);

  app.route('/signup')
    .post(controllers.signup.post);

  app.route('/subscribes')
    .get(controllers.subscribes.get);

  app.route('/participants')
    .post(controllers.participants.post);

  app.route('/users/random')
    .get(controllers.usersRandom.get);

  app.route('/posts')
    .get(controllers.posts.get)
    .post(controllers.posts.post);

  app.route('/dialogs')
    .get(controllers.dialogs.get)
    .post(controllers.dialogs.post)
    .delete(controllers.dialogs.delete);

  app.route('/messages')
    .get(controllers.messages.get);

  app.route('/sessions')
    .delete(controllers.sessions.delete);
*/
};