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

test('Check footer disclamer on main page', {tag:['@web', '@Capex']}, async({app, Capex})=>{
    await test.step(`Open platform and login. User - ${leadUser}`, async()=>{
        await app.signInCapex.open(Capex, 'login')
        await app.signInCapex.loginToPlatform('capexFullReg@capex.com',  process.env.USER_PASSWORD || '')
    })
    await test.step('Check disclaimer text on main page', async()=>{
        await app.mainPageCapex.waitForMainPage()
        await app.mainPageCapex.openMainPageDisclaimer()
        expect(await app.mainPageCapex.getPlatformLicence()).toEqual("KW Investments Ltd operates http://capex.com/en and is authorized and regulated by the Seychelles Financial Services Authority (FSA) (license no. SD020).")
        expect(await app.mainPageCapex.getRiskWarningText()).toEqual("HIGH RISK INVESTMENT WARNING: Trading CFDs is highly speculative, involves significant risk of loss and is not suitable for all investors. Before trading, you are strongly advised to read and ensure that you understand the relevant risk disclosures and warnings. There is a substantial risk that you may lose all of your initial investment. We advise you to consider whether trading leveraged products is appropriate for you in light of your own personal circumstances. We recommend that you ensure you fully understand all risks involved before trading. Trading through an online platform carries additional risks. Please refer to our Legal documents section here.")
    })
})

type languageTypes = {
    language:string,
    translations:string[]
}
const languageParams: languageTypes[] = [
]
test.skip('Default platform languages and traslations', {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout+30000)
    await test.step(`Open platform and login. User - ${leadUser}`, async()=>{
        await app.signInCapex.open(Capex, 'login')
        await app.signInCapex.loginToPlatform('capexFullReg@capex.com',  process.env.USER_PASSWORD || '')
        await app.mainPageCapex.waitForMainPage()
    })
    await test.step
})