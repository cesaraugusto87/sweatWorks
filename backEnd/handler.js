'use strict';
let DDB = require(`./commons/dynamoHandler`);
const {response, createUUID} = require(`./commons/commonFunctions`);

/** Author Create Endpoint
 * @param {{body: Object} | {Records:[{Sns: {Message: string }}]}}  event
 * @param  context
 * @param  callback
 */
module.exports.authorCreate = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {

    let data = event.body ? typeof event.body === 'string' ? JSON.parse(event.body) : event.body : JSON.parse(event.Records[0].Sns.Message);

    let params = {
      TableName: process.env['AUTHORS_TABLE'],
      ScanFilter: {
        "email": {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            data.email
          ]
        }
      }
    };

    DDB.scan(params, function (err, scanData) {
      if (err) {
        console.error("SCAN ERR ", err);
        return response(400, err, callback);
      }

      if (scanData.Count > 0) {
        console.error("AUTHOR_ALREADY_EXISTS_ON_THE_DB");
        return response(400, {message: "AUTHOR ALREADY EXISTS ON THE DB"}, callback)
      }

      let params = {
        TableName: process.env['AUTHORS_TABLE'],
        Item: {
          id: createUUID(),
          email: data.email,
          name: data.name,
          birthDate: data.birthDate
        }
      };

      DDB.save(params, function (err) {
        if (err) {
          console.log('Save Error ', err);
          return response(400, err, callback)
        } else {
          response(200, {message: "AUTHOR SUCCESSFULLY CREATED"}, callback);
        }
      });
    })

  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Read an Author or list of authors.
 * @param {{pathParameters: Object }}  event
 * @param  context
 * @param  callback
 */
module.exports.authorDetail = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.pathParameters;

    let params = {
      TableName: process.env['AUTHORS_TABLE'],
      ScanFilter: {
        "id": {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            data.id
          ]
        }
      }
    };

    DDB.scan(params, function (err, scanData) {
      if (err) {
        console.error(err);
        return response(400, err, callback);
      }

      if (scanData.Count === 0) {
        console.error("AUTHOR_DOES_NOT_EXIST_ON_DB");
        return response(400, {message: "AUTHOR_DOES_NOT_EXIST_ON_DB"}, callback)
      }

      let query = {
        TableName: process.env['PUBLICATIONS_TABLE'],
        ScanFilter: {
          "authorId": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
              data.id
            ]
          }
        }
      };
      DDB.scan(query, function (err, pubData) {
        if (err) {
          console.error(err);
          return response(400, err, callback);
        }
        return response(200, pubData.Items, callback)
      })
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Read an Author or list of authors.
 * @param {{pathParameters: Object }}  event
 * @param  context
 * @param  callback
 */
module.exports.authorAll = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.pathParameters;

    let params = {
      TableName: process.env['AUTHORS_TABLE']
    };

    if (data && data.id) {
      params.ScanFilter = {
        "authorId": {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            data.id
          ]
        }
      }
    }

    DDB.scan(params, function (err, scanData) {
      if (err) {
        console.error(err);
        return response(400, err, callback);
      }

      if (scanData.Count === 0) {
        console.error("AUTHOR_DOES_NOT_EXIST_ON_DB");
        return response(400, {message: "AUTHOR_DOES_NOT_EXIST_ON_DB"}, callback)
      }
      return response(200, scanData.Items, callback)
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Update an Author
 * @param {{body: Object, pathParameters: Object} | {Records:[{Sns: {Message: string }}]}}  event
 * @param  context
 * @param  callback
 */
module.exports.authorUpdate = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    let data = event.body ? typeof event.body === 'string' ? JSON.parse(event.body) : event.body : JSON.parse(event.Records[0].Sns.Message);

    let pathParams = event.pathParameters;

    let params = {
      TableName: process.env['AUTHORS_TABLE'],
      Key: {
        "id": pathParams.id
      },
      UpdateExpression: "set #na = :r, email=:p, birthDate=:s ",
      ExpressionAttributeValues: {
        ":r": data.name,
        ":p": data.email,
        ":s": data.birthDate
      },
      ExpressionAttributeNames: {
        "#na": "name"
      },
      ReturnValues: "UPDATED_NEW"
    };

    DDB.update(params, function (err) {
      if (err) {
        console.error(err);
        return response(400, err, callback);
      }

      return response(200, {message: "Author edited successfully"}, callback)
    })


  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Delete an Author
 * @param {{pathParameters: Object }}  event
 * @param  context
 * @param  callback
 */
module.exports.authorDelete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.pathParameters;

    let query = {
      TableName: process.env['AUTHORS_TABLE'],
      Key: {
        id: data.id
      }
    };

    DDB.delete(query, function (err) {
      if (err) {
        console.log("A Delete Error ", err);
        return response(400, err, callback);
      }
      let query = {
        TableName: process.env['PUBLICATIONS_TABLE'],
        ScanFilter: {
          "authorId": {
            ComparisonOperator: "EQ",
            AttributeValueList: [
              data.id
            ]
          }
        }
      };
      DDB.scan(query, function (err, scanData) {
        if (err) {
          console.log("Scan Error ", err);
          return response(400, err, callback);
        }
        let arrayOfItems = [];
        if (scanData.Count > 0) {
          scanData.Items.forEach(function (obj, i) {
            arrayOfItems.push(new Promise(function (resolve, reject) {
              let params = {
                TableName: process.env['PUBLICATIONS_TABLE'],
                Key: buildKey(obj),
                ReturnValues: 'NONE',
                ReturnConsumedCapacity: 'NONE',
                ReturnItemCollectionMetrics: 'NONE'
              };

              DDB.delete(params, function (err, data) {
                if (err) {
                  console.log("Error on delete ", err);
                  reject(err)
                }
                else resolve(data)
              });
            }))
          });
          Promise.all(arrayOfItems)
            .then(() => response(200, {message: 'DELETED_SUCCESSFULLY'}, callback))
            .catch(() => response(400, {message: 'ERROR_ON_DELETE'}, callback))
        } else {
          return response(200, {message: 'AUTHOR_DELETED_SUCCESSFULLY'}, callback)
        }

      })
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Author Create Endpoint
 * @param {{body: Object} | {Records:[{Sns: {Message: string }}]}}  event
 * @param  context
 * @param  callback
 */
module.exports.publicationCreate = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.body ? typeof event.body === 'string' ? JSON.parse(event.body) : event.body : JSON.parse(event.Records[0].Sns.Message);

    let params = {
      TableName: process.env['AUTHORS_TABLE'],
      ScanFilter: {
        "id": {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            data.authorId
          ]
        }
      }
    };

    console.log("data ", data)

    DDB.scan(params, function (err, scanData) {
      if (err) {
        console.log(err);
        return response(400, err, callback);
      }

      if (scanData.Count === 0) {
        console.log("AUTHOR_DOES_NOT_EXISTS", scanData);
        return response(400, {message: "AUTHOR_DOES_NOT_EXISTS_ON_DB"}, callback)
      }

      let params = {
        TableName: process.env['PUBLICATIONS_TABLE'],
        Item: {
          id: createUUID(),
          createdDateTime: new Date().toISOString(),
          body: data.body,
          title: data.title,
          authorId: data.authorId
        }
      };

      DDB.save(params, function (err) {
        if (err) {
          console.log('Save Error ', err);
          return response(400, err, callback)
        } else {
          response(200, {message: "Publication SUCCESSFULLY CREATED"}, callback);
        }
      });
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Read an Author or list of authors.
 * @param {{pathParameters: Object }}  event
 * @param  context
 * @param  callback
 */
module.exports.publicationDetail = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.pathParameters;

    let params = {
      TableName: process.env['PUBLICATIONS_TABLE'],
      ScanFilter: {
        "id": {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            data.id
          ]
        }
      }
    };

    DDB.scan(params, function (err, scanData) {
      if (err) {
        console.error(err);
        return response(400, err, callback);
      }

      if (scanData.Count === 0) {
        console.error("AUTHOR_DOES_NOT_EXIST_ON_DB");
        return response(400, {message: "AUTHOR_DOES_NOT_EXIST_ON_DB"}, callback)
      }
      return response(200, scanData.Items, callback)
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Read an Author or list of authors.
 * @param {{pathParameters: Object }}  event
 * @param  context
 * @param  callback
 */
module.exports.publicationsAll = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.pathParameters;

    let queryString = event.queryStringParameters

    let params = {
      TableName: process.env['PUBLICATIONS_TABLE']
    };

    if (data && data.id) {
      params.ScanFilter = {
        "authorId": {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            data.id
          ]
        }
      }
    }

    if(queryString && queryString.title){
      params = {
        TableName : process.env['PUBLICATIONS_TABLE'],
        FilterExpression: "contains(#title, :title)",
        ExpressionAttributeNames: {
          "#title": "title",
        },
        ExpressionAttributeValues: {
          ":title": queryString.title
        }
      };
    }

    console.log("aqui ",params);

    DDB.scan(params, function (err, scanData) {
      if (err) {
        console.error(err);
        return response(400, err, callback);
      }

      if (scanData.Count === 0) {
        console.error("Not found");
        return response(400, {message: "Not found"}, callback)
      }
      return response(200, scanData.Items, callback)
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Update an Author
 * @param {{body: Object, pathParameters: Object} | {Records:[{Sns: {Message: string }}]}}  event
 * @param  context
 */
module.exports.publicationUpdate = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {

    let data = event.body ? typeof event.body === 'string' ? JSON.parse(event.body) : event.body : JSON.parse(event.Records[0].Sns.Message);

    let pathParams = event.pathParameters;

    let params = {
      TableName: process.env['PUBLICATIONS_TABLE'],
      Key: {
        "id": pathParams.id
      },
      UpdateExpression: "set body = :r, title=:p",
      ExpressionAttributeValues: {
        ":r": data.body,
        ":p": data.title
      },
      ReturnValues: "UPDATED_NEW"
    };

    DDB.update(params, function (err, scanData) {
      if (err) {
        console.error(err);
        return response(400, err, callback);
      }

      return response(200, {message: 'Publication edited successfully'}, callback)
    })


  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

/** Delete an Author
 * @param {{pathParameters: Object }}  event
 * @param  context
 * @param  callback
 */
module.exports.publicationDelete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let data = event.pathParameters;

    let query = {
      TableName: process.env['PUBLICATIONS_TABLE'],
      Key: {
        id: data.id
      }
    };

    DDB.delete(query, function (err) {
      if (err) {
        console.log("Delete Error ", err);
        return response(400, err, callback);
      }

      return response(200, {message: 'DELETED_SUCCESSFULLY'}, callback);
    })
  } catch (e) {
    console.log("ERROR ", e);
    response(400, {message: "TRY_CATCH_ERROR"}, callback);
  }
};

function buildKey(obj) {
  let key = {};
  key["id"] = obj["id"];
  return key;
}