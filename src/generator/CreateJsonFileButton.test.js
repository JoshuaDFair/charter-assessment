import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateJsonFileButton from './CreateJsonFileButton';

describe('CreateJsonFileButton', () => {
    test('renders the button', () => {
        render(<CreateJsonFileButton />);
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveTextContent('Generate JSON file');
    });

    test('clicking the button generates the JSON file', () => {
        const createObjectURL = jest.fn();
        URL.createObjectURL = createObjectURL;
        const download = jest.fn();
        Object.defineProperty(global.document, 'createElement', {
            value: () => ({
                href: '',
                download: '',
                click: download
            })
        });

        render(<CreateJsonFileButton />);
        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);

        expect(buttonElement).toBeDisabled();
        expect(createObjectURL).toHaveBeenCalledTimes(1);
        expect(download).toHaveBeenCalledTimes(1);
        expect(download.mock.calls[0][0]).toHaveProperty('download', 'customer-data.json');
    });
});
