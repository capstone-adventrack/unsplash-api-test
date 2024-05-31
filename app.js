const readCSV = require('./readCSV');
const Unsplash = require('./searchUnsplash');

require('dotenv').config();

const unsplash = new Unsplash(process.env.ACCESS_KEY);

async function getImageUrls(placeNames) {
  try {
    const fetchPromises = placeNames.map((name) => unsplash.search(name, 1, 1));
    const results = await Promise.all(fetchPromises);
    // console.log('Results:', results);

    return results;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

async function main() {
  const filePath = './tourism_with_id.csv'; // Replace with your CSV file path
  try {
    let placeNames = await readCSV(filePath);
    placeNames = placeNames.slice(0, 10);
    // console.log('Place Names:', placeNames);

    let imageData = await getImageUrls(placeNames);

    // Results is an array of arrays, so we need to get the first element of each array
    const images = imageData.map((result) => result[0]);
    // console.log('Images:', images);

    // Get the URLs of the images
    const imagesURL = images.map((image) => image.url);
    // console.log('Images URL:', imagesURL);

    // remove the params from the URL
    const rawUrl = imagesURL.map((url) => {
      const splitUrl = url.split('?');
      //   console.log('Split URL:', splitUrl);
      return splitUrl[0];
    });

    // console.log('Raw URL:', rawUrl);
    // zip the place names and the image URLs
    for (let i = 0; i < placeNames.length; i++) {
      console.log({
        name: placeNames[i],
        url: rawUrl[i],
      });
    }
  } catch (error) {
    console.error('Error reading CSV file:', error);
  }
}

main();
