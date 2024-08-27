import { expect } from "playwright/test";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SighUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import {test} from "..//..//test-options";
import { MainPage} from "../../pageObjects/MainPage/MainPage";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "../../pageObjects/FullRegistration/NagaMarkets_FullRegistration";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";
import { SighIn } from "../../pageObjects/SighIn/SignInPage";


test.beforeEach("Naga Markets. KYC", async({page, NagaMarkets, NMCountry}, testInfo)=>{
    await testInfo.setTimeout(testInfo.timeout + 120000);
        let sighUp = new SighUp(page);
        let sighIn = new SighIn(page)
        let mainpage = new MainPage(page)
        let verification = new PhoneVerification(page)
        let kycStart = new KYC_Start(page);
        await test.step('Short registration of lead user', async ()=>{
            let email = await sighUp.createLeadUserApi('FR')
            await sighIn.goto(NagaMarkets, 'login');
            await sighIn.sigInUserToPlatform(email, process.env.USER_PASSWORD || "")
        });
        await test.step("Fill personal information, phone verification", async()=>{
            await mainpage.clickUpgradeBtn();
            await kycStart.clickStartVerificationBtn()
            await verification.acceptPhoneNumber()
            await verification.MN_insertVerificationCode()
        })
    })
    
    test("@24921 Naga Markets. KYC - Advance level.", async({page},testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000)
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
            expect(await KYC_FinalStep.getFundAccountText()).toContain(await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("VerifyBanner_TextContent")).toContain(await mainPage.getVerifyBannerContent())
        })
    })
    
    test("@24925 Naga Markets. KYC - PreAdvance level.", async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000)
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
            expect(await KYC_FinalStep.getPreAdvanceFundAccount()).toContain(await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toContain(await mainPage.getVerifyBannerDisclaimerText());
        })
    })

    test("@24920 Naga Markets. KYC - Intermediate level.", async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000)
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
            expect(await KYC_FinalStep.getIntermediateFundAcount()).toContain(await localization.getLocalizationText("KYC_Intermidiate_FundAccount"))
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toContain(await mainPage.getVerifyBannerMiddleScore());
        })
    })

    test("@24923 Naga Markets. KYC - Elementary level.", async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000)
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
            await KYC_FinalStep.clickCheckbox()
            expect(await localization.getLocalizationText("KYC_Elementary_Disclaimer")).toContain(await KYC_FinalStep.getElementaryDisclaimer())
            expect(await localization.getLocalizationText("KYC_Elementary_Description")).toContain(await KYC_FinalStep.getElementaryDescription())
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toContain(await mainPage.getVerifyBannerMiddleScore());
        })
    })

    test("@24922 Naga Markets. KYC - Beginner level.", async({page}, testInfo)=>{
        await testInfo.setTimeout(testInfo.timeout + 120000)
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
            await KYC_FinalStep.clickFundAccount();
        })
        await test.step("Check main page: check accounts and verification banner", async()=>{
            expect(await localizationMainPage.getLocalizationText("PreAdvanceDisclaimerBody")).toContain(await mainPage.getVerifyBannerMiddleScore());
        })
    })
