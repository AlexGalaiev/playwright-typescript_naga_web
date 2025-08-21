import { expect } from "@playwright/test"
import {test} from "..//..//test-options"

let leadUser = 'userLeadCapex@capex.com'
test('Check charts on main page', {tag:['@web', '@Capex']}, async({appIT, Capex}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout+30000)
    await test.step(`Open platform and login. User - ${leadUser}`, async()=>{
        await appIT.signInCapex.open(Capex, 'login')
        await appIT.signInCapex.loginToPlatform(leadUser,  process.env.USER_PASSWORD || '')
    })
    await test.step('Wait for response from charts, also check visibility of charts', async()=>{
        let chartResponse = await appIT.mainPageCapex.getChartResponse()
        expect(chartResponse).toEqual(200)
    })
})