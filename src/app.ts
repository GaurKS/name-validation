import { Bluebird } from "bluebird"
import { MongoClient } from "mongodb"
import { Workbook } from "exceljs"
import * as dotenv from 'dotenv';
import { validateNamesUsingGemini } from "./validateName";
// import validateUsersNames from "./validateName";

// load environment variables
dotenv.config();

const url = process.env.MONGO_URI
const client = new MongoClient(url);

interface UserDetail {
  companyId: number
  first_name: string
  last_name: string
  email: string
  enterpriseId: number
  role?: string
  ownerId?: number
  organization_name?: string
  country?: string
  timezone?: string
}

interface User {
  companyId: number
  first_name: string
  last_name: string
  email: string
  timezone: string
  country: string
}

// excel configuration
function capitalize(value) {
  if (value !== null && typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  return value;
}

// TODO: add items with enterprise id 1
async function main() {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  const userCollection = db.collection(process.env.DB_COLLECTION);
  console.log("---DB connected successfully---");

  let userData = await userCollection
    .find(
      {
        $and: [
          { first_name_validated: { $exists: false } },
          { last_name_validated: { $exists: false } },
          { organization_name_validated: { $exists: false } },
          { createdOn: { $lt: new Date("2024-05-28T07:36:30.270Z") } },
        ],
      },
      {
        projection: {
          _id: 0,
          companyId: { $ifNull: ["$companyId", ""] },
          first_name: { $ifNull: ["$companyName", ""] },
          last_name: { $ifNull: ["$lastName", ""] },
          email: { $ifNull: ["$companyEmail", ""] },
          timezone: { $ifNull: ["$timeZone", ""] },
          country: { $ifNull: ["$country", ""] },
        },
        // enterpriseId, role, ownerId, organization_name
        sort: { createdOn: -1 },
      }
    )
    .toArray();

  console.log("---Data Fetched---");
  console.log("Logging userData: ", userData)
  client.close();
  return userData;
}

const writeToExcel = async (userData) => {
  console.log("---Writing to excel file---");
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("User Data");
  worksheet.columns = [
    { header: "companyId", key: "companyId", width: 10 },
    { header: "first_name", key: "first_name", width: 10 },
    { header: "last_name", key: "last_name", width: 10 },
    { header: "email", key: "email", width: 32 },
    { header: "timezone", key: "timezone", width: 10 },
    { header: "country", key: "country", width: 10 },
  ]
  userData.forEach((user) => {
    worksheet.addRow(user);
  });

  await workbook.xlsx.writeFile("userData.xlsx");
  console.log("Excel file created successfully");

  return true
}


const validateNames = (userData) => {
  const promises = [];
  userData.forEach((user: User) => {
    const userData: UserDetail = {
      companyId: user.companyId,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      enterpriseId: 0,
      role: '',
      ownerId: 1,
      organization_name: '',
      country: user.country,
      timezone: user.timezone,
    }
    promises.push(validateNamesUsingGemini(userData));
  });

  return Bluebird.map(promises, { concurrency: 5, delay: 2000 });
}

async function runWithBatchingAndErrorHandling(promises: Promise<any>[], batchSize: number = 5, delay: number = 2000): Promise<any[]> {
  const results: any[] = [];
  let remainingPromises = promises.slice();

  while (remainingPromises.length > 0) {
    const batch = remainingPromises.splice(0, batchSize);
    const settledResults = await Promise.allSettled(batch);

    settledResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Promise rejected:', result.reason);
        // write to excel
      }
    });

    if (remainingPromises.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay)); // Introduce delay between batches
    }
  }

  return results;
}


const userData = [
  {
    companyId: 110500,
    first_name: 'newspuser',
    last_name: '',
    email: 'labefar937@dxice.com',
    timezone: 'Asia/Kolkata',
    country: 'India'
  },
  {
    companyId: 110483,
    first_name: 'Test1',
    last_name: '',
    email: 'narendra.damodardas.modi.bjp@proton.com',
    timezone: 'Asia/Kolkata',
    country: 'India'
  },
  {
    companyId: 110482,
    first_name: 'Test1',
    last_name: '',
    email: 'narendra.damodardas.modi.bjp@proton.memeee',
    timezone: 'Asia/Kolkata',
    country: 'India'
  },
  {
    companyId: 110481,
    first_name: 'Test1',
    last_name: '',
    email: 'narendra.damodardas.modi.bjp@proton.memee',
    timezone: 'Asia/Kolkata',
    country: 'India'
  },
  {
    companyId: 110070,
    first_name: 'manager213',
    last_name: 'sdaskd',
    email: 'yixer16007@etopys.com',
    timezone: 'Asia/Kolkata',
    country: 'India'
  },
  {
    companyId: 110465,
    first_name: 'rajclient9',
    last_name: '',
    email: 'rajclient9@gmail.com',
    timezone: 'America/New_York',
    country: 'United States'
  }
]

validateNames(userData);





// validation();


// validateUsersNames({
//   companyId: inviteClientData.userId,
//   ownerId,
//   first_name: firstName || '',
//   last_name: lastName || '',
//   email: inviteClientData.userEmail || '',
//   enterpriseId,
//   role: 'C',
// })