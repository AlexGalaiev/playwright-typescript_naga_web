
import { expect } from "@playwright/test"
import {test} from "..//..//test-options"
import { getLocalization } from "../../pageObjects/localization/getText"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { Captcha } from "../../pageObjects/captcha"

test.describe('KYC', async()=>{
    test('NAGA X - High score', {tag:['@prodSanity', '@kyc', '@crypto','@web']}, async({app, AppNAGAX, NagaXCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000);
        let localization = new getLocalization('/pageObjects/localization/NagaX_KYC.json')
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with ${email} on short registration form`, async()=>{
            await app.signUp.goto(AppNAGAX, 'register')
            await new Captcha(app.page).removeCaptcha()
            await app.signUp.createCryptoUser(email, process.env.USER_PASSWORD || "", NagaXCountry)
        })
        await test.step(`Fill personal information on registration popup`, async()=>{
            await app.nagaX_KYC.fillCryptoPersonalInfo()
        })
        await test.step('Insert verification code and wait', async()=>{
            await app.phoneVerification.insertVerificationCode()
            await app.nagaX_KYC.acceptAccountCreationPopup()
        })
        await test.step(`Open KYC and start registration`, async()=>{
            await app.mainPage.cryptoOpenKyc()
            await app.twoAuth.skipAuthenfication();
            await app.mainPage.cryptoOpenKyc()
        })           
        await test.step('Fill KYC', async()=>{
            await app.nagaX_KYC.fillPersonalFullData()
            await app.nagaX_KYC.fillTinData();
            await app.nagaX_KYC.fillAddressInfo()
            await app.nagaX_KYC.fillInvestorProfile()
            let termsAndConditions = await app.nagaX_KYC.acceptTermsAndConditions()
            expect(termsAndConditions).toEqual(await localization.getLocalizationText('TermsAndConditions'))
            await app.nagaX_KYC.finishRegistration()
        })
        await test.step('Check successfull popup',async()=>{
            expect(await app.nagaX_KYC.getSuccessfulMsg()).toEqual(await localization.getLocalizationText('SuccessfullTextPopup'))
            expect(await app.nagaX_KYC.getVerificationMsg()).toEqual(await localization.getLocalizationText('SuccessfullTextVerification'))
        })
    })
})