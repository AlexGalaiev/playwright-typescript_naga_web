import { expect } from "playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "..//..//test-options"


test.describe("KYC Capex EU", async()=>{
    let email = new RandomUser().getRandomUserEmail()

    test.skip('Advance scorring', {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout+160000)
        await test.step(`Create lead user with ${email} email`, async()=>{
            await app.shortRegistrationCapex.open(Capex, 'register')
            await app.shortRegistrationCapex.createLeadUser(email)
        })
        await test.step('Open KYC and s', async()=>{
            await app.mainPageCapex.openCategoryMenu('My Portal')
        })
        await test.step('Fill personal information. Skip deposit', async()=>{
            await app.capexKYC.fillPersonalInformation()
            await app.capexKYC.skipDeposit()
        })
        await test.step('Fill Tax information', async()=>{
            await app.capexKYC.fillTaxInformation()
        })
        await test.step('Fill Financial information', async()=>{
            await app.capexKYC.fillFinancialInformation()
        })
        await test.step('Check risk warning checkboxes', async()=>{
            await app.capexKYC.checkRiskWarningCheckbox()
            expect(await app.capexKYC.checkVerificationScreenAndSubmit()).toBeTruthy()
            await app.capexKYC.passVerification()
        })
        await test.step("Check main page", async()=>{
            expect(await app.mainPageCapex.resumeMyAppBtn()).toBeTruthy()
        })


    })
})