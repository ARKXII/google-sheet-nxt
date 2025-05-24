import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const { fields } = await request.json();

    // Check if credentials exist
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (!credentials) {
      throw new Error(
        "Google Sheets credentials not found in environment variables",
      );
    }

    // Parse credentials safely
    let parsedCredentials;
    try {
      parsedCredentials = JSON.parse(credentials);
    } catch {
      throw new Error(
        "Failed to parse Google Sheets credentials. Please check your .env.local file format.",
      );
    }

    // Google Auth with error handling
    const auth = new google.auth.GoogleAuth({
      credentials: parsedCredentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Check spreadsheet ID
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheet ID not found in environment variables");
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the batch update request
    const requests = [
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 1, startColumnIndex: 3 }, // D2 (currentCredit)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.currentCredit } }] }],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 3, startColumnIndex: 3 }, // D4 (budget)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.budget } }] }],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 16, startColumnIndex: 1 }, // B17 (SOA Date)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.soaDate } }] }],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 16, startColumnIndex: 2 }, // C17 (SOA Amount)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.soaAmount } }] }],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 19, startColumnIndex: 1 }, // B20 (Seabank)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.seabank } }] }],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 20, startColumnIndex: 1 }, // B21 (Projected)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.projected } }] }],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 21, startColumnIndex: 1 }, // B22 (Gotyme Savings)
          rows: [{ values: [{ userEnteredValue: { stringValue: fields.gotyme } }] }],
          fields: "userEnteredValue",
        },
      },
    ];

    // Execute the batch update
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    return Response.json({
      success: true,
      message: "Cells updated successfully",
    });
  } catch (error) {
    console.error("Error updating cells:", error);
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
