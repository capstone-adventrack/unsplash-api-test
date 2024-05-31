// make class to handle the searchUnsplash function
// with constructor to handle the access key
class Unsplash {
  constructor(accessKey) {
    this.accessKey = accessKey;
  }

  async search(query, perPage = 10, page = 1) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${perPage}&page=${page}`;
    const options = {
      method: 'GET',
      headers: {
        'Accept-Version': 'v1',
        Authorization: `Client-ID ${this.accessKey}`,
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const results = data.results;
        const images = results.map((result) => {
          return {
            id: result.id,
            url: result.urls.raw,
          };
        });
        // console.log('images', images);
        if (images.length === 0) {
          console.error(`No images found for ${query}`);
          images.push({
            id: null,
            url: null,
          });
        }
        return images;
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

module.exports = Unsplash;
