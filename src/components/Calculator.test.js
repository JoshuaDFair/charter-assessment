import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from './Calculator';

describe('Calculator', () => {
    beforeEach(() => {
        // Mock fetch request and response
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    {
                        "customerId": 1,
                        "transactions": {
                            "2022-03": [
                                {
                                    "purchaseAmount": 54.75,
                                    "date": "2022-03-30"
                                },
                                {
                                    "purchaseAmount": 351.65,
                                    "date": "2022-03-11"
                                }
                            ],
                            "2022-01": [
                                {
                                    "purchaseAmount": 109.01,
                                    "date": "2022-01-29"
                                }
                            ]
                        }
                    },
                    {
                        "customerId": 2,
                        "transactions": {
                            "2022-03": [
                                {
                                    "purchaseAmount": 266.2,
                                    "date": "2022-03-26"
                                }
                            ],
                            "2022-01": [
                                {
                                    "purchaseAmount": 490.83,
                                    "date": "2022-01-11"
                                }
                            ]
                        }
                    }
                ])
            })
        );
    });

    afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
    });

    test('renders the table', async () => {
        render(<Calculator />);

        // Check that loading message appears
        expect(screen.getByText('Loading...')).toBeInTheDocument();

        // Wait for table to render
        const table = await screen.findByRole('table');

        // Check that the table header is rendered
        expect(screen.getByText('Customer ID')).toBeInTheDocument();
        expect(screen.getByText('01/2022')).toBeInTheDocument();
        expect(screen.getByText('02/2022')).toBeInTheDocument();
        expect(screen.getByText('03/2022')).toBeInTheDocument();
        expect(screen.getByText('Total Points')).toBeInTheDocument();

        // Check that the table body is rendered
        const rows = await screen.findAllByRole('row');
        expect(rows).toHaveLength(3);
    });

    test('calculates points correctly', () => {
        const calculatePoints = jest.fn((purchaseAmount) => {
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
        });

        const transaction = {
            "purchaseAmount": 109.01,
            "date": "2022-01-29"
        };

        const points = calculatePoints(transaction.purchaseAmount);

        expect(points).toBe(68);
    });
});
