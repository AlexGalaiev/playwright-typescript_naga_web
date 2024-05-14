import { expect } from "playwright/test";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import {test} from "..//..//test-options";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "../../pageObjects/FullRegistration/NagaMarkets_FullRegistration";

test.beforeEach("Naga Markets. KYC", async({page, NagaMarkets})=>{
    let KYC_Localization = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let localiztion = new getLocalization(KYC_Localization)
        let sighUp = new SignUp(page);
        let personalInfo = new PersonalInformation(page)
        let verification = new PhoneVerification(page)
        let youAreIn = new YouAreInNagaMarkets(page);
        let kycStart = new KYC_Start(page);
       
        await test.step('Short registration of lead user', async ()=>{
            await sighUp.goto(NagaMarkets, 'register');
            await sighUp.create_NM_CFDUser("France");
        });
        await test.step("Fill personal information, phone verification", async()=>{
            await personalInfo.fillPersonalInformation()
            await verification.MN_insertVerificationCode()
            await youAreIn.getDescriptionText() === await localiztion.getLocalizationText("YouAreInPopupDescription")
            await youAreIn.clickOpenRealMoneyAccount()
        })
        await test.step("Check information on KYC verification start", async()=>{
            await kycStart.getIntroductionText() === await localiztion.getLocalizationText("KYC_Start_introduction");
            await kycStart.getDescriptionText() === await localiztion.getLocalizationText("KYC_Start_description");
            await kycStart.getDisclaimertext() === await localiztion.getLocalizationText("KYC_Start_disclaimer")
            await kycStart.clickStartVerificationBtn();
        })
    })
    
    test("@24921 Naga Markets. KYC - Advance level.", async({page})=>{
        let quiz = new FullRegistration(page)
        let KYC_Advance = "Advance"
        await test.step("Fill KYC advance level", async()=>{
            await quiz.fill_KYC(KYC_Advance)

        })
        
})
