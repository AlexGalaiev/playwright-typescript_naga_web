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
import { Captcha } from "../../pageObjects/captcha"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";


test.describe('KYC WEB', async()=>{
  let email =''
  let AML
  let Scoring

  test.beforeEach("Naga Mena. KYC", async ({ app, AppNAGA }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 200000);
    email = new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user with ${email} via Short registration form`, async () => {
      await app.signUp.goto(AppNAGA, "register");
      await new Captcha(app.page).removeCaptcha()
      await app.signUp.createCfdUser_All(email, process.env.USER_PASSWORD || "", 'United Arab Emirates','+387', '603039647');
    });
    await test.step("Fill Personal information popup. Verify phone number with sms", async () => {
      await app.personalInformation.fillPersonalInformation('Verify with SMS')
    })
    await test.step("Insert verification code. Wait for popup", async()=>{
      await app.phoneVerification.insertVerificationCode()
      await app.youAreIn.clickExplorePlatform()
    })
    await test.step('Click first step on main page', async()=>{
      await app.mainPage.clickOnWidgepPoint('Upgrade to Live')
      await app.kycStart.clickStartVerificationBtn()
    })
  })

  test('KYC Mena - Advance Score', {tag:['@kyc', '@prodSanity','@smoke','@KYC_Mena','@web']}, async({app})=>{
    let KYC_scorring = 'Advance'
    let scoring_AML = 1.485
    let scoring_General = 0.825
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await app.kycMena.fillKYC(KYC_scorring);
      [AML, Scoring] = await app.kycAfrica.finishKycAndGetAML()
      expect(AML).toEqual(scoring_AML)
      expect(Scoring).toEqual(scoring_General)
    })
    await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
      expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Advanced");
      expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await app.KYC_FinalStep.clickBtn('Deposit');  
    })
  })
  test('KYC Mena - PreAdvance Score', {tag:['@kyc', '@KYC_Mena','@web']}, async({app})=>{
    let KYC_scorring = 'PreAdvance'
    let scoring_AML = 1.62
    let scoring_General = 0.67
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await app.kycMena.fillKYC(KYC_scorring);
      [AML, Scoring] = await app.kycMena.finishKycAndGetAML()
      expect(AML).toEqual(scoring_AML)
      expect(Scoring).toEqual(scoring_General)
    })
    await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
      expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
      expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await app.KYC_FinalStep.clickBtn('Deposit');  
    })
  })
  test('KYC Mena - Intermediate Score', {tag:['@kyc', '@KYC_Mena','@web']}, async({app})=>{
    let KYC_scorring = 'Intermediate'
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let scoring_AML = 1.6425
    let scoring_General = 0.2625
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await app.kycMena.fillKYC(KYC_scorring);
      [AML, Scoring] = await app.kycMena.finishKycAndGetAML()
      expect(AML).toEqual(scoring_AML)
      expect(Scoring).toEqual(scoring_General)
    })
    await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
      expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
      expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await app.KYC_FinalStep.clickBtn('Deposit');  
    })
  })

  test('KYC Mena - Elementary Score', {tag:['@kyc','@KYC_Mena','@web']}, async({app})=>{
    let KYC_scorring = 'Elementary'
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let scoring_AML = 1.3275
    let scoring_General = 0.15  
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await app.kycMena.fillKYC(KYC_scorring);
      [AML, Scoring] = await app.kycMena.finishKycAndGetAML()
      expect(AML).toEqual(scoring_AML)
      expect(Scoring).toEqual(scoring_General)
    })
    await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
      expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Elementary");
      expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await app.KYC_FinalStep.clickBtn('Deposit');  
    })
  })
  test('KYC Mena - Beginner Score', {tag:['@kyc','@KYC_Mena','@web']}, async({app})=>{
    let KYC_scorring = 'Beginner'
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let scoring_AML = 1.1475
    let scoring_General = 0.075  
    await test.step(`User email - ${email}. Fill KYC- Beginner scorring`, async()=>{
      await app.kycMena.fillKYC(KYC_scorring);
      [AML, Scoring] = await app.kycMena.finishKycAndGetAML()
      expect(AML).toEqual(scoring_AML)
      expect(Scoring).toEqual(scoring_General)
    })
    await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
      expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Beginner");
      expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await app.KYC_FinalStep.clickBtn('Deposit');  
    })
  })
})

