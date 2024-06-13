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
            expect(await youAreIn.getDescriptionText()).toContain(await localiztion.getLocalizationText("YouAreInPopupDescription"))
            await youAreIn.clickOpenRealMoneyAccount()
        })
        await test.step("Check information on KYC verification start", async()=>{
            expect(await kycStart.getIntroductionText()).toContain(await localiztion.getLocalizationText("KYC_Start_introduction"));
            expect(await kycStart.getDescriptionText()).toContain(await localiztion.getLocalizationText("KYC_Start_description"));
            expect(await kycStart.getDisclaimertext()).toContain(await localiztion.getLocalizationText("KYC_Start_disclaimer"))
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
            expect(await KYC_FinalStep.getUsersScorring()).toEqual('Advanced')
            expect(await localization.getLocalizationText("KYC_Advance_Disclaimer")).toContain(await KYC_FinalStep.getDisclaimer());
            expect(await localization.getLocalizationText("KYC_AdvanceScorring_Footer_description")).toContain(await KYC_FinalStep.getDescription())
            expect(await KYC_FinalStep.getFundAccountText).toContain(await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("VerifyBanner_TextContent")).toContain(await mainPage.getVerifyBannerContent())
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
        await test.step("Fill KYC Preadvance level", async()=>{
            await quiz.fill_KYC(KYC_PreAdvance);
        })
        await test.step("Check KYC status of created account", async()=>{
            expect(await KYC_FinalStep.getUsersScorring()).toEqual('Pre-Advanced')
            expect(await localization.getLocalizationText("KYC_PreAdvance_Disclaimer")).toContain(await KYC_FinalStep.getPreAdvanceDisclaimer());
            expect(await localization.getLocalizationText("KYC_PreAdvance_Footer_quizWarning")).toContain(await KYC_FinalStep.getPreAdvanceWarning())
            expect(await localization.getLocalizationText("KYC_PreAdvance_Footer_description")).toContain(await KYC_FinalStep.getPreAdvanceDescription())
            expect(await KYC_FinalStep.getPreAdvanceFundAccount).toContain(await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toBe(await mainPage.getVerifyBannerDisclaimerText());
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
        await test.step("Fill KYC intermediate level", async()=>{
            await quiz.fill_KYC(KYC_Intermediate);
        })
        await test.step("Check KYC status of created account", async()=>{
            expect(await KYC_FinalStep.getUsersScorring()).toEqual('Intermediate')
            expect(await localization.getLocalizationText("KYC_Intermidiate_Warning")).toContain(await KYC_FinalStep.getIntermediateWarning())
            expect(await localization.getLocalizationText("KYC_Intermidiate_Disclaimer")).toContain(await KYC_FinalStep.getIntermediateDisclaimer())
            expect(await localization.getLocalizationText("KYC_Intermidiate_Desription")).toContain(await KYC_FinalStep.getIntermediateDescription())
            expect(await KYC_FinalStep.getIntermediateFundAcount).toContain(await localization.getLocalizationText("KYC_Intermidiate_FundAccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toBe(await mainPage.getVerifyBannerDisclaimerText());
            await mainPage.clickIUnderstanBtn();
        })
    })

    test("@24923 Naga Markets. KYC - Elementary level.", async({page})=>{
        let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json"
        let quiz = new FullRegistration(page)
        let localization = new getLocalization(kycFinishContent)
        let localizationMainPage = new getLocalization(mainPageLocalization)
        let KYC_Elementary = "Elementary";
        let KYC_FinalStep = new FinalStep(page)
        let mainPage = new MainPage(page)
        await test.step("Fill KYC elementary level", async()=>{
            await quiz.fill_KYC(KYC_Elementary);
        })
        await test.step("Check KYC status of created account", async()=>{
            expect(await KYC_FinalStep.getUsersScorring()).toEqual('Elementary')
            expect(await localization.getLocalizationText("KYC_Elementary_Warning")).toContain(await KYC_FinalStep.getElementaryWarning())
            expect(await localization.getLocalizationText("KYC_Elementary_Disclaimer")).toContain(await KYC_FinalStep.getElementaryDisclaimer())
            expect(await localization.getLocalizationText("KYC_Elementary_Description")).toContain(await KYC_FinalStep.getElementaryDescription())
            expect(await KYC_FinalStep.getIntermediateFundAcount()).toContain(await localization.getLocalizationText("KYC_Elementary_FundAccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toContain(await mainPage.getVerifyBannerDisclaimerText());
            await mainPage.clickIUnderstanBtn();
        })
    })

    test("@24922 Naga Markets. KYC - Beginner level.", async({page})=>{
        let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json"
        let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json"
        let quiz = new FullRegistration(page)
        let localization = new getLocalization(kycFinishContent)
        let localizationMainPage = new getLocalization(mainPageLocalization)
        let KYC_Beginner = "Beginner";
        let KYC_FinalStep = new FinalStep(page)
        let mainPage = new MainPage(page)
        await test.step("Fill KYC beginner level", async()=>{
            await quiz.fill_KYC(KYC_Beginner);
        })
        await test.step("Check KYC status of created account", async()=>{
            expect(await KYC_FinalStep.getUsersScorring()).toEqual('Beginner Account')
            expect(await localization.getLocalizationText("KYC_Beginer_warning")).toContain(await KYC_FinalStep.getBeginnerWarning())
            expect(await localization.getLocalizationText("KYC_Beginer_disclaimer")).toContain(await KYC_FinalStep.getBeginnerDisclaimer())
            expect(await localization.getLocalizationText("KYC_Beginer_fundAccount")).toContain(await KYC_FinalStep.getBeginnerDescription())
            expect(await KYC_FinalStep.getBeginnerFundAccount()).toContain(await localization.getLocalizationText("KYC_Beginer_retakeQUIZ"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toContain(await mainPage.getVerifyBannerDisclaimerText());
            await mainPage.clickIUnderstanBtn();
        })
    })
