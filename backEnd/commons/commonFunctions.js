let common = {

  response: (status, body, callback) => {

    return callback(null, {
      statusCode: status, headers: {
        "Access-Control-Allow-Origin": "*"
      }, body: JSON.stringify(body)
    });
  },
  createUUID: () => {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
};

module.exports = common;