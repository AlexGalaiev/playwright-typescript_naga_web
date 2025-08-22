import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "..//..//test-options"


test.describe("KYC Capex EU", async()=>{
    let email = new RandomUser().getRandomUserEmail()

    test('Advance scorring', {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout+60000)
        await test.step(`Create lead user with ${email} email`, async()=>{
            await app.shortRegistrationCapex.open(Capex, 'register')
            await app.shortRegistrationCapex.createLeadUser(email)
        })
        await test.step('Open KYC and s', async()=>{
            await app.mainPageCapex.openKyc()
        })

    })
})