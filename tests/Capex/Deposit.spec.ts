import { expect } from "@playwright/test"
import {test} from "..//..//test-options"
test.describe('Deposit functionality', async()=>{

    type depositTypes = {
        user: string,
        level: string
    }

    const depositParams: depositTypes[] = [
        {user: 'userLeadCapex@capex.com', level: 'Lead'},
        {user: 'capexFullReg@capex.com', level: 'Fully registered' }
    ]
    for(const{user, level} of depositParams){
        test(`Open praxis ${level} user with ${user} email`, {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout+35000)
        await test.step(`Open platform and login. User - ${user}`, async()=>{
            await app.signInCapex.open(Capex, 'login')
            await app.signInCapex.loginToPlatform(user,  process.env.USER_PASSWORD || '')
        })
        await test.step('Check response data from praxis', async()=>{
            let [dataResponse, dataStatus] = await app.depositCapex.openDepositFromMainPageAndChooseValue('100')
            expect(await app.depositCapex.getResponseFrontendName(dataResponse)).toEqual('sc.capex.com USD')
            expect(await app.depositCapex.getBaseAmount(dataResponse)).toEqual(100)
            expect(await dataStatus).toEqual(200)
        })})
    }
    


})