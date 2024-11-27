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

test.describe('Naga X. KYC', async()=>{

    test('@25263 Full registration', {tag:['@prodSanity', '@kyc']}, async({page, NagaX}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 60000);
        let signUp = new SignUp(page)
        let personlInformation = new PersonalInformation(page);
        let verifiaction = new PhoneVerification(page)
        let successPopup = new YouAreInCrypto(page)
        let mainPage = new MainPage(page)
        let KYC = new NagaX_KYC(page)
        let finishPopup = new FinishPopup(page)
        let localization = new getLocalization('/pageObjects/localization/NagaX_KYC.json')
        await test.step("Create lead customer", async()=>{
            await signUp.goto(NagaX, 'register')
            await signUp.createCryptoUser('Bosnia and Herzegovina')
        })
        await test.step('Fill personal information and proceed registration. Skip authenfication', async()=>{
            await personlInformation.fillCryptoPersonalInfo()
            await verifiaction.insertVerificationCode_Crypto();
            await successPopup.acceptPopup()  
            await mainPage.clickVerifyBtn_NagaX();
            await new TwoAuthenfication(page).skipAuthenfication();
            await mainPage.clickVerifyBtn_NagaX();
        })
        await test.step('Add more personal information', async()=>{
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