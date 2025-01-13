
import { expect } from "@playwright/test"
import { TwoAuthenfication } from "../../pageObjects/FullRegistration/components/NagaX_2Auth"
import { YouAreInCrypto } from "../../pageObjects/FullRegistration/components/NagaX_succesfullVerificationPopup"
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification"
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation"
import { NagaX_KYC } from "../../pageObjects/FullRegistration/NagaX_FullRegistration"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "..//..//test-options"
import { getLocalization } from "../../pageObjects/localization/getText"
import { FinishPopup } from "../../pageObjects/FullRegistration/components/NagaX_FinishRegistrationPopup"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { NagaXAddPopup } from "../../pageObjects/FullRegistration/components/NagaX_AdditionalPopup"

test.describe('Naga X ', async()=>{
//commit #180
    test('@25365 KYC - High score', {tag:['@prodSanity', '@kyc']}, async({page, NagaX, NagaXCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000);
        let signUp = new SignUp(page)
        let mainPage = new MainPage(page)
        let KYC = new NagaX_KYC(page)
        let finishPopup = new FinishPopup(page)
        let inPlatformPopup = new YouAreInCrypto(page)
        let localization = new getLocalization('/pageObjects/localization/NagaX_KYC.json')
        let email = await signUp.createLeadUserApi("BA")
        await test.step(`Create lead user with ${email}`, async()=>{
            await signUp.goto(NagaX, 'register')
            await signUp.createCryptoUser(email, process.env.USER_PASSWORD || "", NagaXCountry)
        })
        await test.step(`Fill personal information`, async()=>{
            await new PersonalInformation(page).fillCryptoPersonalInfo()
            await new PhoneVerification(page).insertVerificationCode()
            await inPlatformPopup.acceptAccountCreationPopup()
        }) 
        await test.step(`Open KYC and start registration`, async()=>{
            await mainPage.cryptoOpenKyc()
            await new TwoAuthenfication(page).skipAuthenfication();
            await mainPage.cryptoOpenKyc()
        })           
        await test.step('Fill KYC', async()=>{
            await KYC.fillPersonalFullData()
            await KYC.fillTinData();
            await KYC.fillAddressInfo()
            await KYC.fillInvestorProfile()
            let termsAndConditions = await KYC.acceptTermsAndConditions()
            expect(termsAndConditions).toEqual(await localization.getLocalizationText('TermsAndConditions'))
            await KYC.finishRegistration()
        })
        await test.step('Check successfull popup',async()=>{
            expect(await finishPopup.getSuccessfulMsg()).toEqual(await localization.getLocalizationText('SuccessfullTextPopup'))
            expect(await finishPopup.getVerificationMsg()).toEqual(await localization.getLocalizationText('SuccessfullTextVerification'))
        })
    })
})