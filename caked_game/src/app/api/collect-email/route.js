import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(request) {
    try {
        // Parse the incoming request body
        const { email } = await request.json();

        // Basic email validation
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { message: 'Invalid email address' },
                { status: 400 }
            );
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
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 400 }
            );
        }

        // Add new row
        await sheet.addRow({
            email: email,
            subscribedAt: new Date().toISOString()
        });

        return NextResponse.json(
            { message: 'Email successfully collected!' },
            { status: 200 }
        );
    }
    catch (error) {
        console.error('Email collection error:', error);
        return NextResponse.json(
            { message: 'Subscription failed', details: error.message },
            { status: 500 }
        );
    }
}