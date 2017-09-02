module.exports = app => {
  app.db.sequelize.sync().done(() => {
    app.listen(3012, () => console.log('API app started'));
});
};