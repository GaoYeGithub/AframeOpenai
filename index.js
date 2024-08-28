const express = require('express');
const axios = require('axios');
const readline = require('readline');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

let latestResponse = 'Waiting for input...';

app.get('/response', (req, res) => {
    res.json({ response: latestResponse });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    getUserInput();
});

function getUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter a prompt for OpenAI: ', async (input) => {
        try {
            const response = await axios.post('https://jamsapi.hackclub.dev/openai/chat/completions', {
                prompt: input,
                model: 'gpt-3.5-turbo',
                max_tokens: 50,
            }, {
                headers: {
                    'Authorization': `Bearer 3MOH8Y0XDAMZQPW98RB00VTS512087HOZOCFYS8L1GXUJ34Z72L0U3NE3BK6KEXX`
                }
            });

            console.log(response.data);

            if (response.data.error) {
                latestResponse = 'API error: ' + response.data.error.message;
            } else if (response.data.choices && response.data.choices[0]) {
                latestResponse = response.data.choices[0].text.trim();
            } else {
                latestResponse = 'Unexpected response format from OpenAI.';
            }

            console.log(`AI Response: ${latestResponse}`);
        } catch (error) {
            console.error('Error communicating with OpenAI:', error.message);
            latestResponse = 'Error communicating with OpenAI.';
        }

        getUserInput();
    });
}
