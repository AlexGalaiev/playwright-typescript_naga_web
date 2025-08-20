import { expect } from "@playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "..//..//test-options"
test.describe('Capex short registration page', async()=>{
let leadUser = 'userLeadCapex@capex.com'
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
        await app.signInCapex.loginToPlatform(leadUser, 'Test123!')
    })
    await test.step('Wait for Capex main page', async()=>{
        await app.mainPageCapex.waitForMainPage()
        await app.mainPageCapex.userLogOut()
        })
    await test.step('Check sign in page', async()=>{
        expect(await app.signInCapex.checkPageTitleIsVisible()).toBeTruthy()
    })
    })
})