const fs = require('fs');
const csv = require('csv-parser');

function addToString(str, value) {
  // if string is not empty, add a space before the value
  if (str) {
    return str + ' ' + value;
  }
  return str + value;
}

async function readCSV(filePath) {
  const placeNames = [];
  const readStream = fs.createReadStream(filePath).pipe(csv());

  for await (const data of readStream) {
    let placeName = '';

    // Check if the data has a 'Place_Name' key
    if (data['Place_Name']) {
      placeName = addToString(placeName, data['Place_Name']);
    }

    // // Check if the data has a 'City' key
    // if (data['City']) {
    //   placeName = addToString(placeName, data['City']);
    // }

    placeNames.push(placeName);
  }

  return placeNames;
}

module.exports = readCSV;
