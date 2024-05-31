const readCSV = require('./readCSV');
const Unsplash = require('./searchUnsplash');

require('dotenv').config();

const unsplash = new Unsplash(process.env.ACCESS_KEY);
const batchSizes = 10;

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

  const place = await readCSV(filePath);
  console.log('Place:', place);

  const numberOfBatch = Math.ceil(place.length / batchSizes);
  console.log('Number of batch:', numberOfBatch);

  const reminder = place.length % batchSizes;

  // Loop to get the images in batches
  for (let batch = 0; batch < numberOfBatch; batch++) {
    // define the image count
    let imageCount = batchSizes;

    // If the loop is at the last iteration
    if (batch === numberOfBatch - 1) {
      imageCount = reminder;
    }

    // Slice the array to batchSize elements
    const index = batch * batchSizes;
    console.log('Index:', index);
    console.log('Image Count:', imageCount);
    const placeToGet = place.slice(index, index + imageCount);

    // Get the names of the places
    const placeNames = placeToGet.map((placeToGet) => placeToGet.name);
    console.log('Place Names:', placeNames);

    let imageData = await getImageUrls(placeNames);

    // Results is an array of arrays, so we need to get the first element of each array
    const images = imageData.map((result) => result[0]);
    console.log('Images:', images);

    // Get the URLs of the images
    const imagesURL = images.map((image) => image.url);
    console.log('Images URL:', imagesURL);

    // remove the params from the URL
    const rawUrl = imagesURL.map((url) => {
      if (!url) {
        return null;
      }
      const splitUrl = url.split('?');
      // console.log('Split URL:', splitUrl);
      return splitUrl[0];
    });

    // console.log('Raw URL:', rawUrl);
    // zip the place names and the image URLs
    for (let i = 0; i < placeToGet.length; i++) {
      console.log({
        id: placeToGet[i].id,
        name: placeToGet[i].name,
        url: rawUrl[i],
      });
    }

    await startRandomCountdown();
  }
}

// Function to generate a random float between min (inclusive) and max (exclusive)
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to wait for a specified duration in milliseconds
function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// Function to start the countdown with a random duration
async function startRandomCountdown() {
  // Get a random float value for the countdown duration (between 1 and 10 seconds)
  var countdownDuration = getRandomFloat(1, 10) * 1000; // Convert seconds to milliseconds

  // Set the target date for the countdown
  var targetDate = new Date().getTime() + countdownDuration;

  // Update the countdown every second until it's over
  while (true) {
    // Get the current date and time
    var currentDate = new Date().getTime();

    // Calculate the remaining time
    var timeRemaining = targetDate - currentDate;

    // Check if the countdown is over
    if (timeRemaining <= 0) {
      console.log('Countdown is over!');
      break;
    } else {
      // Calculate minutes and seconds
      var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Output the countdown
      console.log('Countdown:', minutes + 'm ' + seconds + 's');
    }

    // Wait for 1 second before updating the countdown
    await wait(1000);
  }
}

main();
