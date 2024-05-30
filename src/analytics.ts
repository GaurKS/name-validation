import axios from './utils/axios'
import { DynamicObjectType } from './utils/object'
import * as dotenv from 'dotenv'
dotenv.config()

type CrmData = {
  en: string
  companyId: number
  role: string
  ownerId: number
  data?: DynamicObjectType
  enterpriseId: number
  productId: number
  userCompanyId?: number
  mixpanel?: string
  isTeamMemeberEntry?: boolean
  teamIds?: number[]
  clientIds?: number[]
}

export default async (ctx: CrmData) => {
  if (ctx.productId === 1) {
    await axios.post(`${process.env.SP_REST_URL}/crm-platfrom`, {
      ...ctx,
      isPlatformEntry: true,
    })
  }
  if (ctx.productId === 2) {
    await axios.post(`${process.env.REVIEW_REST_URL}/crm-platfrom`, {
      ...ctx,
      en: `Rv ${ctx.en}`,
      userId: ctx.companyId,
      isPlatformEntry: true,
    })
  }
}
