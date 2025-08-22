import { expect } from "@playwright/test"
import {test} from "..//..//test-options"

test.describe('External services. Trading Central', async()=>{

    let fullRegUser = 'capexFullReg@capex.com'

    test.beforeEach('Login to platform by user', async({app, Capex}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout+30000)
        await test.step(`Open platform and login. User - ${fullRegUser}`, async()=>{
            await app.signInCapex.open(Capex, 'login')
            await app.signInCapex.loginToPlatform(fullRegUser,  process.env.USER_PASSWORD || '')
        })
    })

    test('Economic calendar', {tag:['@web', '@Capex']}, async({app, Capex})=>{
        await test.step('Check status code of trading central response', async()=>{
            await app.mainPageCapex.openCategoryMenu('Trading Central')
            let statusCode = await app.mainPageCapex.openTradingCentralMenu('Economic Calendar', 'https://global.tradingcentral.com/dist/web-economic-insight/**')
            expect(statusCode).toEqual(200)
        })
    })
    test('Analyst Views', {tag:['@web', '@Capex']}, async({app, Capex})=>{
        await test.step('Check status code of trading central response', async()=>{
            await app.mainPageCapex.openCategoryMenu('Trading Central')
            let statusCode = await app.mainPageCapex.openTradingCentralMenu('Analyst Views', 'https://site.recognia.com/capex/**')
            expect(statusCode).toEqual(200)
        })
    })
})