import { GoogleGenerativeAI } from '@google/generative-ai'
// import * as companyMasterQueries from 'SPDatabase/queries/companyMaster'
// import * as authQueries from 'platformDatabase/queries/auth'
import SPMongoDB from './utils/spdDatabase'
import platformDB from './utils/platformDB'
import analytics from './analytics'
import * as dotenv from 'dotenv'
import geminiConfig from './gemini.config'
dotenv.config()

// analytics
// sendMessages
// platformDB
// SPMongoDB
// authQueries
// companyMasterQueries

interface UserDetails {
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

interface ValidationResponse {
  error: boolean,
  msg?: string,
  first_name: string
  last_name: string
  organization_name: string
}


const capitalizeFirstLetter = (word: string) => {
  if (typeof word !== 'string' || word.length === 0) return ''
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * This function validates user details using Google's Generative AI model.
 * It capitalizes the first letter of each detail and returns the validated details.
 */
export const validateNamesUsingGemini = async (
  userDetails: UserDetails,
): Promise<ValidationResponse> => {
  try {
    const genAI = new GoogleGenerativeAI(geminiConfig.apiKey)
    const model = genAI.getGenerativeModel({
      model: geminiConfig.model,
      generationConfig: geminiConfig.generationConfig,
      safetySettings: geminiConfig.safetySettings,
    })

    const user = {
      first_name: userDetails.first_name || '',
      last_name: userDetails.last_name || '',
      email: userDetails.email || '',
      organization_name: userDetails.organization_name || '',
      country: userDetails.country || '',
      timezone: userDetails.timezone || '',
    }

    const input = { text: 'input: ' + JSON.stringify(user) }
    const parts = [...geminiConfig.prompt, input]
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
    })

    const response = result?.response?.text()
    let res: Partial<ValidationResponse> = {}
    try {
      res = JSON.parse(response || '{}')
    } catch (error) {
      // error
    }

    return {
      error: false,
      first_name: capitalizeFirstLetter(res.first_name || ''),
      last_name: capitalizeFirstLetter(res.last_name || ''),
      organization_name: capitalizeFirstLetter(res.organization_name || ''),
    }
  } catch (error) {
    // try {
    //   const serverType = process.env.ENVIRONMENT
    //   const environment = (serverType && serverType.toUpperCase()) || 'UNKNOWN'
    //   const message = `*${environment} | USERS_NAME_VALIDATION_GEMINI* | <!date^${Math.floor(
    //     new Date().getTime() / 1000,
    //   )}^{date_long} {time_secs}|Update Slack.>\n
    //   Error occurred while validating user's names using gemini
    //   \`\`\` ${error.message} \n \`\`\``
    //   sendMessages(['ai-logs'], message)
    // } catch (err) {
    //   // ignore err
    // }
    return {
      error: true,
      msg: error.message,
      first_name: '',
      last_name: '',
      organization_name: '',
    }
  }
}

// const validateUsersNames = async (userDetails: UserDetails) => {
//   const { companyId, role, ownerId, enterpriseId } = userDetails
//   try {
//     if (!companyId) return
//     const response = await validateNamesUsingGemini(userDetails)
//     const data = {
//       first_name_validated: response.first_name || '',
//       last_name_validated: response.last_name || '',
//       organization_name_validated: response.organization_name || '',
//     }

//     // update user details in platformDB and companyMaster
//     await Promise.all([
//       authQueries.updateUserDetailsById(platformDB, data, companyId),
//       companyMasterQueries.updateCompanyDetailsByCondition(
//         SPMongoDB,
//         companyId,
//         data,
//       ),
//     ])
//     await analytics({
//       en: 'Update Users Names',
//       companyId: ownerId,
//       userCompanyId: companyId,
//       data: {
//         first_name_validated: data.first_name_validated,
//         last_name_validated: data.last_name_validated,
//         organization_name_validated: data.organization_name_validated,
//       },
//       isTeamMemeberEntry: !!['A', 'T'].includes(role),
//       enterpriseId,
//       productId: 1,
//       mixpanel: 'N',
//       role,
//       ownerId,
//     })
//   } catch (error) {
//     // try {
//     //   const serverType = process.env.ENVIRONMENT
//     //   const environment = (serverType && serverType.toUpperCase()) || 'UNKNOWN'
//     //   const message = `*${environment} | USERS_NAME_VALIDATION* | <!date^${Math.floor(
//     //     new Date().getTime() / 1000,
//     //   )}^{date_long} {time_secs}|Update Slack.>
//     //   companyId: ${companyId}, ownerId: ${ownerId}\n
//     //   Error occurred while validating user's names
//     //   \`\`\` ${error.message} \n \`\`\``
//     //   sendMessages(['ai-logs'], message)
//     // } catch (err) {
//     //   // ignore err
//     // }
//   }
// }

exports.validateNamesUsingGemini = validateNamesUsingGemini