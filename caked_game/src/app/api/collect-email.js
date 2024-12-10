import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Parse the incoming request body
        const { email } = req.body;

        // Basic email validation
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // Properly format the private key
        const privateKey = process.env.GOOGLE_PRIVATE_KEY
            ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined;

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_EMAIL,
            key: privateKey,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        // Initialize Google Sheets
        const doc = new GoogleSpreadsheet(
            process.env.GOOGLE_SHEET_ID,
            serviceAccountAuth
        );

        // Load the document
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // First sheet

        // Check for duplicate emails
        const rows = await sheet.getRows();
        const isDuplicate = rows.some(row => row.get('email') === email);

        if (isDuplicate) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Add new row
        await sheet.addRow({
            email: email,
            subscribedAt: new Date().toISOString()
        });

        return res.status(200).json({ message: 'Email successfully collected!' });
    }
    catch (error) {
        console.error('Email collection error:', error);
        return res.status(500).json({
            message: 'Subscription failed',
            details: error.message
        });
    }
}