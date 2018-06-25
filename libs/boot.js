module.exports = app => {
  app.db.sequelize.sync().done(() => {
    app.listen(process.env.PORT || 3012, () => console.log('API app started'));
});
};