import { expect } from "@playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "..//..//test-options"
test.describe('Capex short registration page', async()=>{
let leadUser = 'userLeadCapex@capex.com'
//capexFullReg@capex.com
    test('Create lead user on Capex EU', {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
        let email = new RandomUser().getRandomUserEmail()
        testInfo.setTimeout(testInfo.timeout+60000)
        await test.step(`Open Capex platform and fill personal information, email - ${email}`, async()=>{
            await app.shortRegistrationCapex.open(Capex, 'register')
            await app.shortRegistrationCapex.createLeadUser(email)
        })
        await test.step('Wait for Capex main page', async()=>{
            await app.mainPageCapex.waitForMainPage()
            await app.mainPageCapex.userLogOut()
        })
        await test.step('Check sign in page', async()=>{
            expect(await app.signInCapex.checkPageTitleIsVisible()).toBeTruthy()
        })
    })

    test(`Login- Logout to Capex platform by user - ${leadUser}`, 
        {tag:['@web','@Capex']}, async({app, Capex}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout+30000)
    await test.step(`Open platform and login. User - ${leadUser}`, async()=>{
        await app.signInCapex.open(Capex, 'login')
        await app.signInCapex.loginToPlatform(leadUser,  process.env.USER_PASSWORD || '')
    })
    await test.step('Wait for Capex main page', async()=>{
        await app.mainPageCapex.waitForMainPage()
        await app.mainPageCapex.userLogOut()
        })
    await test.step('Check sign in page', async()=>{
        expect(await app.signInCapex.checkPageTitleIsVisible()).toBeTruthy()
    })
    })

    test(`Forgot password for email - ${leadUser}`, {tag:['@web', '@Capex']}, async({app, Capex})=>{
        await test.step(`Open Capex platform and fill personal information, email - ${leadUser}`, async()=>{
            await app.shortRegistrationCapex.open(Capex, 'login')
        })
        await test.step('Open forgot password page, and check forgot password respone', async()=>{
            await app.signInCapex.openForgotPasswordPage()
            let response = await app.signInCapex.checkForgotPasswordResponse(leadUser)
            expect(await app.signInCapex.getStatusCode(response)).toEqual(200)
            expect(await app.signInCapex.getStatusMessage(response)).toEqual('OK')

        })
    })
    
    test('Check Sign In page Risk Warning text', {tag:['@web', '@Capex']}, async({app, Capex})=>{
        await test.step(`Open platform and login. User - ${leadUser}`, async()=>{
            await app.signInCapex.open(Capex, 'login')
        })
        await test.step('Check Risk Warning message', async()=>{
            expect(await app.shortRegistrationCapex.getSignInRiskWarningText()).toEqual('CAPEX is a brand name operated by KW Investments Ltd, authorised and regulated by the Seychelles Financial Services Authority (FSA). Trading leveraged products involves significant risk and may not be suitable for all investors. Please read the Risk Disclosure before trading.')
        })
    })
})