import { expect } from "playwright/test";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import {test} from "..//..//test-options";
import { MainPage} from "../../pageObjects/MainPage/MainPage";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "../../pageObjects/FullRegistration/NagaMarkets_FullRegistration";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";

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
        let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json"
        let quiz = new FullRegistration(page)
        let localization = new getLocalization(kycFinishContent)
        let localizationMainPage = new getLocalization(mainPageLocalization)
        let KYC_Advance = "Advance";
        let KYC_FinalStep = new FinalStep(page)
        let mainPage = new MainPage(page)
        await test.step("Fill KYC advance level", async()=>{
            await quiz.fill_KYC(KYC_Advance);
        })
        await test.step("Check KYC status of created account", async()=>{
            await KYC_FinalStep.getUsersScorring() === 'Advanced'
            await localization.getLocalizationText("KYC_Advance_Disclaimer") === await KYC_FinalStep.getDisclaimer();
            await localization.getLocalizationText("KYC_AdvanceScorring_Footer_description") === await KYC_FinalStep.getDescription()
            await KYC_FinalStep.getFundAccountText == await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount")
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            await localizationMainPage.getLocalizationText("VerifyBanner_TextContent") === await mainPage.getVerifyBannerContent()
        })
    })
    
    test("@24925 Naga Markets. KYC - PreAdvance level.", async({page})=>{
        let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json"
        let quiz = new FullRegistration(page)
        let localization = new getLocalization(kycFinishContent)
        let localizationMainPage = new getLocalization(mainPageLocalization)
        let KYC_PreAdvance = "PreAdvance";
        let KYC_FinalStep = new FinalStep(page)
        let mainPage = new MainPage(page)
        await test.step("Fill KYC advance level", async()=>{
            await quiz.fill_KYC(KYC_PreAdvance);
        })
        await test.step("Check KYC status of created account", async()=>{
            await KYC_FinalStep.getUsersScorring() === 'Pre-Advanced'
            await localization.getLocalizationText("KYC_PreAdvance_Disclaimer") === await KYC_FinalStep.getPreAdvanceDisclaimer();
            await localization.getLocalizationText("KYC_PreAdvance_Footer_quizWarning") === await KYC_FinalStep.getPreAdvanceWarning()
            await localization.getLocalizationText("KYC_PreAdvance_Footer_description") === await KYC_FinalStep.getPreAdvanceDescription()
            await KYC_FinalStep.getPreAdvanceFundAccount == await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount")
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody") === await mainPage.getVerifyBannerDisclaimerText();
            await mainPage.clickIUnderstanBtn();
        })
    })

    test("@24920 Naga Markets. KYC - Intermediate level.", async({page})=>{
        let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json"
        let quiz = new FullRegistration(page)
        let localization = new getLocalization(kycFinishContent)
        let localizationMainPage = new getLocalization(mainPageLocalization)
        let KYC_Intermediate = "Intermediate";
        let KYC_FinalStep = new FinalStep(page)
        let mainPage = new MainPage(page)
        await test.step("Fill KYC advance level", async()=>{
            await quiz.fill_KYC(KYC_Intermediate);
        })
        await test.step("Check KYC status of created account", async()=>{
            await KYC_FinalStep.getUsersScorring() === 'Intermediate'
            await localization.getLocalizationText("KYC_Intermidiate_Warning") === await KYC_FinalStep.getIntermediateWarning();
            await localization.getLocalizationText("KYC_Intermidiate_Disclaimer") === await KYC_FinalStep.getIntermediateDisclaimer()
            await localization.getLocalizationText("KYC_Intermidiate_Desription") === await KYC_FinalStep.getIntermediateDescription()
            await KYC_FinalStep.getIntermediateFundAcount == await localization.getLocalizationText("KYC_Intermidiate_FundAccount")
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody") === await mainPage.getVerifyBannerDisclaimerText();
            await mainPage.clickIUnderstanBtn();
        })
    })

    test("@24923 Naga Markets. KYC - Elementary level.", async({page})=>{
        let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json"
        let quiz = new FullRegistration(page)
        let localization = new getLocalization(kycFinishContent)
        let localizationMainPage = new getLocalization(mainPageLocalization)
        let KYC_Intermediate = "Elementary";
        let KYC_FinalStep = new FinalStep(page)
        let mainPage = new MainPage(page)
        await test.step("Fill KYC advance level", async()=>{
            await quiz.fill_KYC(KYC_Intermediate);
        })
        await test.step("Check KYC status of created account", async()=>{
            await KYC_FinalStep.getUsersScorring() === 'Elementary'
            await localization.getLocalizationText("KYC_Elementary_Warning") === await KYC_FinalStep.getElementaryWarning();
            await localization.getLocalizationText("KYC_Elementary_Disclaimer") === await KYC_FinalStep.getElementaryDisclaimer()
            await localization.getLocalizationText("KYC_Elementary_Description") === await KYC_FinalStep.getElementaryDescription()
            await KYC_FinalStep.getIntermediateFundAcount() == await localization.getLocalizationText("KYC_Elementary_FundAccount")
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody") === await mainPage.getVerifyBannerDisclaimerText();
            await mainPage.clickIUnderstanBtn();
        })
    })
