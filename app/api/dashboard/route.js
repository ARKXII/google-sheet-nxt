import { google } from "googleapis";

export async function POST(request) {
  try {
    const { fields } = await request.json();

    // Check if credentials exist
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (!credentials) {
      throw new Error(
        "Google Sheets credentials not found in environment variables"
      );
    }

    // Parse credentials safely
    let parsedCredentials;
    try {
      parsedCredentials = JSON.parse(credentials);
    } catch {
      throw new Error(
        "Failed to parse Google Sheets credentials. Please check your .env.local file format."
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
          rows: [
            {
              values: [
                { userEnteredValue: { stringValue: fields.currentCredit } },
              ],
            },
          ],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 3, startColumnIndex: 3 }, // D4 (budget)
          rows: [
            { values: [{ userEnteredValue: { stringValue: fields.budget } }] },
          ],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 16, startColumnIndex: 1 }, // B17 (SOA Date)
          rows: [
            { values: [{ userEnteredValue: { stringValue: fields.soaDate } }] },
          ],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 16, startColumnIndex: 2 }, // C17 (SOA Amount)
          rows: [
            {
              values: [{ userEnteredValue: { stringValue: fields.soaAmount } }],
            },
          ],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 19, startColumnIndex: 1 }, // B20 (Seabank)
          rows: [
            { values: [{ userEnteredValue: { stringValue: fields.seabank } }] },
          ],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 20, startColumnIndex: 1 }, // B21 (Projected)
          rows: [
            {
              values: [{ userEnteredValue: { stringValue: fields.projected } }],
            },
          ],
          fields: "userEnteredValue",
        },
      },
      {
        updateCells: {
          range: { sheetId: 0, startRowIndex: 21, startColumnIndex: 1 }, // B22 (Gotyme Savings)
          rows: [
            { values: [{ userEnteredValue: { stringValue: fields.gotyme } }] },
          ],
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
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const credentials = process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (!credentials) throw new Error("Missing Google Sheets credentials");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error("Missing Google Sheet ID");

    // Fetch all data in a single batch request
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [
        "Summary!B1", // totalSpending
        "Summary!B2", // installment
        "Summary!B3", // totalBudget
        "Summary!B4", // remainingBudget
        "Summary!D2", // currentCredit
        "Summary!D4", // budget
        "Summary!A7:C12", // Matrix data
        "Summary!C17",
        "Summary!B20",
        "Summary!B21",
        "Summary!B22",
        "Summary!B24",
      ],
    });

    return Response.json({
      individualCells: {
        totalSpending: response.data.valueRanges[0].values?.[0]?.[0] || null,
        installment: response.data.valueRanges[1].values?.[0]?.[0] || null,
        totalBudget: response.data.valueRanges[2].values?.[0]?.[0] || null,
        remainingBudget: response.data.valueRanges[3].values?.[0]?.[0] || null,
        currentCredit: response.data.valueRanges[4].values?.[0]?.[0] || null,
        budget: response.data.valueRanges[5].values?.[0]?.[0] || null,
        ewsoa: response.data.valueRanges[7].values?.[0]?.[0] || null,
        seabank: response.data.valueRanges[8].values?.[0]?.[0] || null,
        projected: response.data.valueRanges[9].values?.[0]?.[0] || null,
        gotyme: response.data.valueRanges[10].values?.[0]?.[0] || null,
        need: response.data.valueRanges[11].values?.[0]?.[0] || null,
      },
      matrix: response.data.valueRanges[6].values || [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
