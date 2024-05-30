const { HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
require("dotenv").config();

const prompt = [
  {
    text:
      'You are tasked with Named Entity Recognition (NER), focusing on extracting, classifying and verifying first names, last names, and organization names from provided user data. The input data includes the user\'s first name, last name, and email address. Sometimes, users might enter their organization\'s name instead of their personal names. Use the domain part of the email address (after the "@") as a hint to help classify organization names.\n\nEntity Categories:\n- First Name: The user\'s given name from any cultural or geographic background.\n- Last Name: The user\'s family name or surname from any cultural or geographic background.\n- Organization Name: Represents entities like companies, organizations, firms, multinational corporations (MNCs), brands, private limited companies, agencies, etc., such as Google, Samsung, or Apple.\n\nIf the input doesn\'t match any category accurately, the output should leave the respective fields empty.\n\nInput Format:\n{ "first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "organization_name": "eCom", "country": "" , "timezone": ""}\n\nDesired Output Format:\n{ "first_name": "John", "last_name": "Doe", "organization_name": "" }\n\nYour task is to generate an output object structured as follows:\n{ "first_name": "", "last_name": "", "organization_name": "" }\nClassify details only if you are more than 99% sure. \nEnsure you retry and refine the classification 3-4 times to produce the best possible result.',
  },
  {
    text:
      'input: { "first_name": "Alice", "last_name": "smith", "email": "alice.smith@company.com", "organization_name": ""}',
  },
  {
    text:
      'output: { "first_name": "Alice", "last_name": "Smith", "organization_name": "" }',
  },
  {
    text:
      'input: { "first_name": "Tech", "last_name": "", "email": "info@techcorporation.com", "organization_name": "" }',
  },
  {
    text:
      'output: { "first_name": "", "last_name": "", "organization_name": "Tech" }',
  },
  {
    text:
      'input: { "first_name": "randomtext", "last_name": "", "email": "email@unknown.com" }',
  },
  {
    text:
      'output: { "first_name": "", "last_name": "", "organization_name": "" }',
  },
  {
    text:
      'input: { "first_name": "eCom Team", "last_name": "calvin", "email": "calvin@e-com.co.za", "organization_name": "eCom" }',
  },
  {
    text:
      'output: {  "first_name": "Calvin", "last_name": "", "organization_name": "eCom" }',
  },
  {
    text:
      'input: { "first_name" : "Linta", "last_name" : "Mathew", "email" : "lmatthew@tredigital.com",    "organization_name" : "Tredigital", "timezone" : "America/Vancouver",    "country" : "India" }',
  },
  {
    text:
      'output: { "first_name" : "Linta", "last_name" : "Mathew", "organization_name" : "Tredigital" }',
  },
  {
    text:
      'input: { "first_name" : "Timothy ", "last_name" : "Thomas", "email" : "timothy.thomas@edelweiss-digital.at", "country": "Austria", "timezone": "Europe/Vienna"}',
  },
  {
    text:
      'output: { "first_name" : "Timothy", "last_name" : "Thomas", "organization_name" : "Edelweiss-Digital"}',
  },
  {
    text:
      'input: { "country" : "India", "first_name" : "Chovatiya Parth", "last_name" : "SocialPilot", "email" : "parthdrummer@socialpilot.co", "timezone" : "India/Kolkata"}',
  },
  {
    text:
      'output: { "first_name" : "Parth", "last_name" : "Chovatiya", "organization_name" : "SocialPilot"}',
  },
  {
    text:
      'input: { "country" : "Portugal", "first_name" : "Eniyan", "last_name" : "Demo", "email" : "website@eniyan.de", "timezone" : "Europe/Berlin"}',
  },
  {
    text:
      'output: { "first_name" : "", "last_name" : "", "organization_name" : "Eniyan" }',
  },
  {
    text:
      'input: { "country" : "Netherlands", "first_name" : "Elmer", "last_name" : "Bunte", "email" : "info@smartechsolutions.nl", "timezone" : "Europe/Amsterdam"}',
  },
  {
    text:
      'output: { "first_name" : "Elmer", "last_name" : "Bunte", "organization_name" : "Smartech Solutions" }',
  },
  {
    text:
      'input: { "country" : "Australia", "first_name" : "Ready", "last_name" : "Enable", "email" : "info@readyenable.com.au", "timezone" : "Australia/Sydney"}',
  },
  {
    text:
      'output: { "first_name" : "", "last_name" : "", "organization_name" : "Ready Enable" }',
  },
  {
    text:
      'input: { "country" : "Italy", "first_name" : "Social Arca", "email" : "social@arcadistribution.com", "timezone" : "Europe/Rome" }',
  },
  {
    text:
      'output: { "first_name" : "", "last_name" : "", "organization_name" : "Arca Distribution" }',
  },
  {
    text:
      'input: { "country" : "Pakistan", "first_name" : "Mr", "last_name" : "qamar", "email" : "ikramali2090@gmail.com", "timezone" : "Asia/Karachi" }',
  },
  {
    text:
      'output: { "first_name" : "Qamar", "last_name" : "", "organization_name" : "" }',
  },
  {
    text:
      'input: { "country" : "India", "first_name" : "Tamakuwala Raj", "last_name" : "", "email" : "info@gmail.com", "timezone" : "India/Kolkata" },',
  },
  {
    text:
      'output: { "first_name" : "Raj", "last_name" : "Tamakuwala", "organization_name" : "" }',
  },
  {
    text:
      'input: { "country" : "United States", "first_name" : "Mento", "last_name" : "Client", "email" : "mento.client@blondmail.com", "timezone" : "America/New_York" }',
  },
  {
    text:
      'output: { "first_name" : "", "last_name" : "", "organization_name" : "" }',
  },
  {
    text:
      'input: { "country" : "India", "first_name" : "team", "last_name" : "punit", "email" : "myteam752@gmail.com", "timezone" : "Asia/Kolkata"}',
  },
  {
    text:
      'output: { "first_name" : "Punit", "last_name" : "", "organization_name" : ""}',
  },
  {
    text:
      'input: { "country" : "Saudi Arabia", "first_name" : "Jenan ", "last_name" : "Rajhi", "email" : "jrajhi@aromatic.sa", "timezone" : "Asia/Riyadh"}',
  },
  {
    text:
      'output: { "first_name" : "Jenan", "last_name" : "Rajhi", "organization_name" : "Aromatic" }',
  },
  {
    text:
      'input: { "country" : "India", "first_name" : "SocialPilot ", "last_name" : "Pratik", "email" : "rajsharma@gmail.com", "timezone" : "Asia/Kolkata"}',
  },
  {
    text:
      'output: { "first_name" : "Pratik", "last_name" : "", "organization_name" : "SocialPilot" }',
  },
  {
    text:
      'input: { "country" : "India", "first_name" : "SocialPilot ", "last_name" : "Pratik", "email" : "rajsharma@gmail.com", "timezone" : "Asia/Kolkata"}',
  },
  {
    text:
      'output: { "first_name" : "Pratik", "last_name" : "", "organization_name" : "SocialPilot" }',
  },
]


export default {
  model: process.env.GEMINI_MODEL,
  apiKey: process.env.GEMINI_API_KEY,
  // Gemini Safety Settings
  // Explore all Harm categories here -> https://ai.google.dev/api/rest/v1beta/HarmCategory
  // Explore all threshold categories -> https://ai.google.dev/docs/safety_setting_gemini
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
  generationConfig: {
    temperature: 0.4,
    topK: 1,
    topP: 1,
    maxOutputTokens: 256,
  },
  prompt,
}