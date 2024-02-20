const express = require('express');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const openai = require('./src/ai.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Function to get the cost of a product (replace with your own logic)
function getProductCost(productName) {
    // Replace this with your own logic to fetch the cost of the product from your database or any other source
    // For now, returning a placeholder value
    const productCosts = {
        'item1': 50,
        'item2': 100,
        // Add more products as needed
    };

    return productCosts[productName] || 0; // Return 0 if the product cost is not found
}

app.post('/ussd', async (req, res) => {
    const { text } = req.body;
    let response = '';
    const textParts = text.split('*');

    if (text === '') {
        response = 'CON Welcome to mamapesa\n 1. Save for an asset\n2. Loan\n3. Chat with pesa AI \n4. Pay to till\n5. Deposit funds\n0. Exit';
    } else {
        switch (textParts[0]) {
            case '1':
                // Business logic for option 1 (Save for an asset)
                if (textParts.length === 1) {
                    response = 'CON Enter the name of the asset you want to save for:';
                } else if (textParts.length === 2) {
                    const assetName = textParts[1];
                    // Implement logic to process asset saving
                    response = `CON Enter the amount you want to save for ${assetName}:`;
                } else if (textParts.length === 3) {
                    const assetName = textParts[1];
                    const saveAmount = textParts[2];
                    // Implement logic to save for the specified asset
                    response = `END You have successfully saved ${saveAmount} for ${assetName}.`;
                }
                break;

            case '2':
                // Business logic for option 2 (Loan)
                if (textParts.length === 1) {
                    response = 'CON Enter the name of the product you want a loan for:';
                } else if (textParts.length === 2) {
                    const productName = textParts[1];
                    // Implement logic to retrieve the cost of the product
                    const productCost = getProductCost(productName);
                    response = `CON The cost of ${productName} is ${productCost}. Enter the amount you want to loan for this product:`;
                } else if (textParts.length === 3) {
                    const productName = textParts[1];
                    const loanAmount = textParts[2];
                    // Implement logic to process loan for the specified product
                    response = `END Loan request successful. You will receive ${loanAmount} for ${productName} shortly.`;
                }
                break;

            case '3':
                // Business logic for option 3 (Chat with pesa AI)
                // Add logic to interact with AI                
                if (textParts.length > 1) {
                    const question = textParts[1];
                    try {
                        const outcome = await openai.askAboutAgriculture(question);
                        response = `END ${outcome}`;
                    } catch (error) {
                        response = 'END An error occurred while processing your request. Please try again.';
                    }
                } else {
                    response = 'CON Please ask any Agricultural related question. For example: How to plant maize';
                }
                break;

            case '4':
                // Business logic for option 4 (Pay to till)
                if (textParts.length === 1) {
                    response = 'CON Enter the till number:';
                } else if (textParts.length === 2) {
                    const tillNumber = textParts[1];
                    // Implement logic to process payment to the specified till
                    response = `END Payment to till ${tillNumber} successful.`;
                }
                break;

            case '5':
                // Business logic for option 5 (Deposit funds)
                if (textParts.length === 1) {
                    response = 'CON Enter the amount you want to deposit:';
                } else if (textParts.length === 2) {
                    const depositAmount = textParts[1];
                    // Implement logic to process fund deposit
                    response = `END Deposit of ${depositAmount} successful.`;
                }
                break;

            case '0':
                // Business logic for option 0 (Exit)
                response = 'END You have exited Mamapesa. Thank you for using our service.';
                break;

            default:
                // Invalid option
                response = 'END Invalid input. Please try again.';
                break;
        }
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.use('*', (_req, res) => res.status(400).send('Invalid route. Please check your URL and try again.'));

app.listen(PORT, () => {
    console.log
})