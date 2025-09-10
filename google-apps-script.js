// Google Apps Script Code with CORS Headers
// Copy this entire code to your Google Apps Script project

// Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheets ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const SHEET_NAME = 'Feedback'; // Change this to your sheet name if different

/**
 * Handles GET requests - returns a simple response
 */
function doGet(e) {
  const response = {
    status: 'success',
    message: 'Hotel Feedback API is running',
    timestamp: new Date().toISOString()
  };
  
  return createCORSResponse(response);
}

/**
 * Handles POST requests - processes feedback data
 */
function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.choice || typeof data.choice !== 'number') {
      return createCORSResponse({
        status: 'error',
        message: 'Invalid choice value'
      }, 400);
    }
    
    // Get the spreadsheet and sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 4).setValues([[
        'Timestamp', 'Choice', 'Emoji', 'User Agent'
      ]]);
    }
    
    // Map choice number to emoji
    const emojis = ['😡', '😕', '😐', '🙂', '😍'];
    const emoji = emojis[data.choice - 1] || '❓';
    
    // Prepare row data
    const rowData = [
      new Date().toISOString(),
      data.choice,
      emoji,
      data.ua || 'Unknown'
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    const response = {
      status: 'success',
      message: 'Feedback recorded successfully',
      data: {
        choice: data.choice,
        emoji: emoji,
        timestamp: rowData[0]
      }
    };
    
    return createCORSResponse(response);
    
  } catch (error) {
    console.error('Error processing feedback:', error);
    
    return createCORSResponse({
      status: 'error',
      message: 'Failed to process feedback: ' + error.toString()
    }, 500);
  }
}

/**
 * Creates a response with proper CORS headers
 */
function createCORSResponse(data, statusCode = 200) {
  const response = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  response.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
  
  return response;
}

/**
 * Handles OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return createCORSResponse({ status: 'ok' });
}

/*
SETUP INSTRUCTIONS:

1. Replace SPREADSHEET_ID:
   - Create a new Google Sheet or use an existing one
   - Copy the spreadsheet ID from the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   - Replace 'YOUR_SPREADSHEET_ID' with your actual ID

2. Update SHEET_NAME if needed:
   - The script will create a 'Feedback' sheet automatically
   - Change SHEET_NAME if you want a different name

3. Deploy the script:
   - Click 'Deploy' > 'New deployment'
   - Choose 'Web app' as the type
   - Set 'Execute as' to 'Me'
   - Set 'Who has access' to 'Anyone'
   - Click 'Deploy'
   - Copy the web app URL (it should end with /exec)

4. Update your React app:
   - Replace YOUR_SCRIPT_ID in App.tsx with the script ID from the deployment URL
   - The URL format should be: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

5. Test the integration:
   - Open your React app
   - Click on an emoji
   - Check the browser console for logs
   - Verify data appears in your Google Sheet
*/