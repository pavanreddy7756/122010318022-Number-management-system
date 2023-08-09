const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const TIMEOUT = 500;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls) {
        return res.status(400).json({ error: 'Please provide at least one URL' });
    }

    const urlList = Array.isArray(urls) ? urls : [urls];

    const fetchNumbers = async (url) => {
        try {
            const response = await axios.get(url, { timeout: TIMEOUT });
            const data = response.data;
            if (Array.isArray(data.numbers)) {
                return data.numbers;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching numbers from ${url}: ${error.message}`);
            return [];
        }
    };

    try {
        const results = await Promise.all(urlList.map(fetchNumbers));
        const mergedNumbers = [...new Set(results.flat())].sort((a, b) => a - b);
        res.json({ numbers: mergedNumbers });
    } catch (error) {
        console.error(`Error processing request: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
