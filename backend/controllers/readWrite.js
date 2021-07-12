const fs = require('fs');
const dataPath = './backend/db/users.json';

exports.readFile = (filePath = dataPath, returnJson = false, callback, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
};

exports.writeFile = writeFile = (filePath = dataPath, fileData, callback, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, err => {
      if (err) {
        throw err;
      }

      callback();
    });
};
