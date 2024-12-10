# Serverless Email Collection for CakeQuest

## Option 1: Vercel Serverless Functions (Recommended for React Projects)

### Step 1: Project Setup
```bash
# Create a new React project with Vite
npm create vite@latest cake-quest -- --template react
cd cake-quest
npm install axios
```

### Step 2: Create Serverless Function
Create a directory structure:
```
cake-quest/
├── src/
│   └── components/
│       └── EmailCollector.jsx
└── api/
    └── collect-email.js
```

### Serverless Function (api/collect-email.js)
```javascript
import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
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
```

### Frontend Component (src/components/EmailCollector.jsx)
```jsx
import React, { useState } from 'react';
import axios from 'axios';

const EmailCollector = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ 
    message: '', 
    type: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/collect-email', { email });
      
      setStatus({
        message: response.data.message,
        type: 'success'
      });
      
      setEmail(''); // Clear input
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || 'Subscription failed',
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex">
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-grow px-4 py-2 border rounded-l-lg"
        />
        <button 
          type="submit" 
          className="bg-pink-500 text-white px-4 py-2 rounded-r-lg"
        >
          Subscribe
        </button>
      </div>
      
      {status.message && (
        <div className={`
          mt-2 p-2 rounded text-center
          ${status.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'}
        `}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default EmailCollector;
```

### Vercel Configuration
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Create vercel.json in project root:
```json
{
  "functions": {
    "api/collect-email.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### Environment Variables in Vercel
In Vercel Dashboard:
- GOOGLE_SHEET_ID: Your Google Sheet ID
- GOOGLE_SERVICE_EMAIL: Service account email
- GOOGLE_PRIVATE_KEY: Private key from service account

## Alternative: Netlify Serverless Functions
```javascript
// netlify/functions/collect-email.js
exports.handler = async (event, context) => {
  // Similar implementation to Vercel function
  // Use Netlify's environment variables
  // Return standard HTTP response
};
```

## Key Dependencies
```bash
npm install axios google-spreadsheet
```

## Best Practices
1. Use environment variables
2. Implement robust error handling
3. Validate inputs
4. Protect against spam
5. Provide clear user feedback
```

## Setup Guide

### Google Sheets Integration
1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a Service Account
4. Generate and download JSON credentials
5. Share your Google Sheet with the service account email

### Deployment Steps
1. Push to GitHub
2. Connect Vercel/Netlify to your repository
3. Set environment variables
4. Deploy

## Potential Enhancements
- Add rate limiting
- Implement CAPTCHA
- Create welcome email automation
- Build a basic analytics dashboard
```

## Monitoring & Analytics
- Use Vercel/Netlify logs
- Implement basic tracking
- Consider adding Google Analytics
```

## Security Considerations
- Never expose API keys
- Use environment variables
- Implement input validation
- Add rate limiting
```

## Optional Integrations
1. Mailchimp
2. SendGrid
3. Custom email service
```