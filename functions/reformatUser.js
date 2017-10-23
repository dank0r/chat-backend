module.exports = (u) => ({
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