import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
    console.log('testings')
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    try {
        // Initialize Google Sheets
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

        // Authentication (use service account credentials)
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        });

        // Load the document
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // First sheet

        // Check for duplicate emails
        const rows = await sheet.getRows();
        const isDuplicate = rows.some(row => row.email === email);

        if (isDuplicate) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Add new row
        await sheet.addRow({
            email: email,
            subscribedAt: new Date().toISOString()
        });

        return res.status(200).json({ message: 'Successfully subscribed!' });
    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({
            message: 'Error processing subscription',
            error: error.message
        });
    }
}