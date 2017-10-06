const collect = async (callback) => {
  try {
    await callback();
    process.exit(0);
  } catch (error) {
    console.log(error); //eslint-disable-line
    console.log('Done.'); //eslint-disable-line
    process.exit(1);
  }
};

module.exports = collect;
