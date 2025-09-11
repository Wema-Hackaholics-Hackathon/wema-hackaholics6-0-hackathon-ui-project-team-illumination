// import { google } from "googleapis";
// import dotenv from "dotenv";

// dotenv.config();

// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// const sheets = google.sheets("v4");

// // Auth setup
// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     type: "service_account",
//     project_id: process.env.GOOGLE_PROJECT_ID,
//     private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     client_email: process.env.GOOGLE_CLIENT_EMAIL,
//   },
//   scopes: SCOPES,
// });

// /**
//  * Save verification record to Google Sheets
//  * @param {Object} record - verification result object
//  */
// export async function saveRecordToSheet(record) {
//   try {
//     const client = await auth.getClient();

//     const request = {
//       auth: client,
//       spreadsheetId: process.env.GOOGLE_SHEET_ID, // put your sheet id in .env
//       range: "Sheet1!A:Z", // adjust to your sheet
//       valueInputOption: "RAW",
//       insertDataOption: "INSERT_ROWS",
//       resource: {
//         values: [[
//           record.id,
//           record.bvn,
//           record.inputAddress,
//           record.addressLat,
//           record.addressLng,
//           record.deviceLat,
//           record.deviceLng,
//           record.deviceAccuracy,
//           record.panoLat,
//           record.panoLng,
//           record.heading,
//           record.distance,
//           record.imageUrl,
//           record.result,
//           record.createdAt
//         ]],
//       },
//     };

//     const response = await sheets.spreadsheets.values.append(request);
//     console.log("✅ Record saved to Google Sheets");
//     return response.data;
//   } catch (error) {
//     console.error("❌ Error saving to Google Sheets:", error.message);
//     throw error;
//   }
// }
