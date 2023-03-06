import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const calculatePoints = (purchaseAmount) => {
                let truncatedAmount = Math.trunc(purchaseAmount);
                let points = 0;

                if (truncatedAmount > 100) {
                    points += (truncatedAmount - 100) * 2;
                    truncatedAmount = 100;
                }

                if (truncatedAmount >= 50) {
                    points += (truncatedAmount - 50);
                }

                return points;
            };

            const calculateMonthlyPoints = (transactions) => {
                const monthlyPoints = {};

                for (const transaction of transactions) {
                    const date = new Date(transaction.date);
                    const year = date.getFullYear();
                    const month = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                    const points = calculatePoints(transaction.purchaseAmount);

                    if (monthlyPoints[month] === undefined) {
                        monthlyPoints[month] = 0;
                    }

                    monthlyPoints[month] += points;
                }

                return monthlyPoints;
            };

            const calculateCustomerPoints = (customers) => {
                const customerPoints = {};

                for (const customer of customers) {
                    const customerId = customer.customerId;
                    customerPoints[customerId] = {};

                    for (const month in customer.transactions) {
                        const transactions = customer.transactions[month];
                        const points = calculateMonthlyPoints(transactions);
                        customerPoints[customerId][month] = points;
                    }
                }

                return customerPoints;
            };

            try {
                const response = await fetch('data.json'); // relative path to customer-data.json
                const jsonData = await response.json();
                const customerPoints = calculateCustomerPoints(jsonData);
                setData(customerPoints);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {data ? (
                <table>
                    <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>01/2022</th>
                        <th>02/2022</th>
                        <th>03/2022</th>
                        <th>Total Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(data).map((customerId) => {
                        const pointsByMonth = {};
                        let totalPoints = 0;

                        for (const month in data[customerId]) {
                            pointsByMonth[month] = Object.values(data[customerId][month]).reduce((a, b) => a + b);
                            totalPoints += pointsByMonth[month];
                        }

                        return (
                            <tr key={customerId}>
                                <td>{customerId}</td>
                                <td>{pointsByMonth['2022-01'] || 0}</td>
                                <td>{pointsByMonth['2022-02'] || 0}</td>
                                <td>{pointsByMonth['2022-03'] || 0}</td>
                                <td>{totalPoints}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Calculator;
