import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { test } from "../../test-options";
import { MenaFullRegistration } from "../../pageObjects/FullRegistration/NagaMena_FullRegistration";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";
import { getLocalization } from "../../pageObjects/localization/getText";


test.beforeEach("Naga Mena. KYC", async ({ page, NagaMena }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 150000);
    let signUp = new SignUp(page);
    let kycStart = new KYC_Start(page);
    let email = new RandomUser().getRandomUserEmail()
    let mainPage = new MainPage(page)
    await test.step(`Create lead user via API. Login by ${email} to platform`, async () => {
      await signUp.goto(NagaMena, "register");
      await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || "", 'United Arab Emirates');
    });
    await test.step("Fill personal information and verify phone number", async () => {
      await new PersonalInformation(page).fillPersonalInformation('Verify with SMS')
      await new PhoneVerification(page).insertVerificationCode()
      await mainPage.openKyc()
      await kycStart.clickStartVerificationBtn()
    })
  })

  test('@25253 KYC - Advance Score', {tag:['@kyc', '@prodSanity','@smoke']}, async({page})=>{
    let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Advance'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization(kycFinishContent);
    await test.step('Fill KYC- Advance scorring', async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step('Verify scorring banner', async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Advanced");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
      expect(await new MainPage(page).getMainPageBannerText()).toContain('Verify your identity')
    })
  })
  test('@25361 KYC - PreAdvance Score', {tag:'@kyc'}, async({page})=>{
    let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'PreAdvance'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization(kycFinishContent);
    await test.step('Fill KYC- PreAdvance scorring', async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step('Verify scorring banner', async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
      expect(await new MainPage(page).getMainPageBannerText()).toContain('Verify your identity')
    })
  })
  test('@25362 KYC - Intermediate Score', {tag:'@kyc'}, async({page})=>{
    let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Intermediate'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization(kycFinishContent);
    await test.step('Fill KYC- Intermediate scorring', async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step('Verify scorring banner', async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
      expect(await new MainPage(page).getMainPageBannerText()).toContain('Verify your identity')
    })
  })
  test('@25363 KYC - Elementary Score', {tag:'@kyc'}, async({page})=>{
    let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Elementary'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization(kycFinishContent);
    await test.step('Fill KYC- Elementary scorring', async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step('Verify scorring banner', async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Elementary");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
      expect(await new MainPage(page).getMainPageBannerText()).toContain('Verify your identity')
    })
  })
  test('@25364 KYC - Beginner Score', {tag:'@kyc'}, async({page})=>{
    let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Beginner'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization(kycFinishContent);
    await test.step('Fill KYC- Beginner scorring', async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step('Verify scorring banner', async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Beginner");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
      expect(await new MainPage(page).getMainPageBannerText()).toContain('Verify your identity')
    })
  })
