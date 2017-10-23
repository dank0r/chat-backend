module.exports = (obj, prop) => {
  console.log('obj: ', obj);
  console.log('prop: ', prop);
  return Object.keys(obj)
    .reduce((prev, val) => {
      if (val !== prop)
      return Object.assign({}, prev, { [val]: obj[val] });
    }, {});
};