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
  const places = [];
  const readStream = fs.createReadStream(filePath).pipe(csv());

  for await (const data of readStream) {
    let placeId = '';
    let placeName = '';

    // Check if the data has a 'Place_Id' key
    if (data['Place_Id']) {
      placeId = addToString(placeId, data['Place_Id']);
    }

    // Check if the data has a 'Place_Name' key
    if (data['Place_Name']) {
      placeName = addToString(placeName, data['Place_Name']);
    }

    // // Check if the data has a 'City' key
    // if (data['City']) {
    //   placeName = addToString(placeName, data['City']);
    // }

    places.push({
      id: placeId,
      name: placeName,
    });
  }

  return places;
}

module.exports = readCSV;
