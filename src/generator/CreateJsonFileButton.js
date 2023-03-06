import React, { useState } from 'react';
import './CreateJsonFileButton.css';

const generateCustomerId = () => {
    return Math.floor(Math.random() * 200) + 1;
};

const generateCustomerData = () => {
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2022-03-31');
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const customers = {};

    for (let i = 0; i < 1000; i++) {
        const customerId = generateCustomerId();
        const purchaseAmount = Number((Math.random() * 500).toFixed(2)); // generate a random purchase amount between 0 and 200
        const date = new Date(startDate.getTime() + Math.random() * days * 24 * 60 * 60 * 1000);
        const month = date.toISOString().slice(0, 7); // get month in ISO string format (YYYY-MM)
        if (!customers[customerId]) {
            customers[customerId] = { id: customerId, transactions: {} };
        }
        if (!customers[customerId].transactions[month]) {
            customers[customerId].transactions[month] = [];
        }
        customers[customerId].transactions[month].push({ purchaseAmount, date: date.toISOString().slice(0, 10) });
    }

    return Object.values(customers);
};

const CreateJsonFileButton = () => {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateJsonFile = () => {
        setIsGenerating(true);
        const filename = 'customer-data.json';
        const customerData = generateCustomerData();
        const json = JSON.stringify(customerData, null, 2); // convert customer data to JSON format with pretty printing
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        try {
            const link = document.createElement('a');
            link.href = href;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
        }
        setIsGenerating(false);
    };

    return (
        <div>
            <button onClick={generateJsonFile} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate JSON file'}
            </button>
        </div>
    );
};

export default CreateJsonFileButton;
