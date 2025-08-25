import { expect } from "@playwright/test"
import {test} from "..//..//test-options"

test.describe('External services. Trading Central', async()=>{

    let fullRegUser = 'capexFullReg@capex.com'

    test.beforeEach('Login to platform by user', async({appMax, Capex}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout+30000)
        await test.step(`Open platform and login. User - ${fullRegUser}`, async()=>{
            await appMax.signInCapex.open(Capex, 'login')
            await appMax.signInCapex.loginToPlatform(fullRegUser,  process.env.USER_PASSWORD || '')
        })
    })

    test('Economic calendar', {tag:['@web', '@Capex']}, async({appMax})=>{
        await test.step('Check status code of trading central response', async()=>{
            await appMax.mainPageCapex.openCategoryMenu('Trading Central')
            let statusCode = await appMax.mainPageCapex.openTradingCentralMenu('Economic Calendar', 'https://global.tradingcentral.com/dist/web-economic-insight/**')
            expect(statusCode).toEqual(200)
        })
    })
    test('Analyst Views', {tag:['@web', '@Capex']}, async({appMax})=>{
        await test.step('Check status code of trading central response', async()=>{
            await appMax.mainPageCapex.openCategoryMenu('Trading Central')
            let statusCode = await appMax.mainPageCapex.openTradingCentralMenu('Analyst Views', 'https://site.recognia.com/capex/**')
            expect(statusCode).toEqual(200)
        })
    })
})