import axios from 'axios';

export default async (req, res) => {
  try {
    const imageUrl = req.query.url;

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const contentType = response.headers['content-type'];
    res.setHeader('Content-Type', contentType);
    
    res.send(response.data);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Unable to fetch image' });
  }
};
