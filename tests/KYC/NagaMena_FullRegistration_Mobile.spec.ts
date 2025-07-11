import { expect } from "@playwright/test";
import { Captcha } from "../../pageObjects/captcha";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { getLocalization } from "../../pageObjects/localization/getText";
import { test } from "../../test-options";

test.describe('KYC Mobile', async()=>{
    let email =''
  
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
        await app.mainPage.clickOnMobileWidget('Step 1/3: Upgrade to Live')
        await app.kycStart.clickStartVerificationBtn()
      })
    })
  
    test('KYC Mena - Advance Score', {tag:['@KYC_Mena', '@mobile']}, async({app})=>{
      let KYC_scorring = 'Advance'
      let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
      await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
        await app.kycMena.fillKYC(KYC_scorring)
      })
      await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
        expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Advanced");
        expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
        await app.KYC_FinalStep.clickBtn('Deposit');  
      })
    })
  
    test('KYC Mena - PreAdvance Score', {tag:['@KYC_Mena','@mobile']}, async({app})=>{
      let KYC_scorring = 'PreAdvance'
      let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
      await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
        await app.kycMena.fillKYC(KYC_scorring)
      })
      await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
        expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
        expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
        await app.KYC_FinalStep.clickBtn('Deposit');  
      })
    })
    test('KYC Mena - Intermediate Score', {tag:['@KYC_Mena','@mobile']}, async({app})=>{
      let KYC_scorring = 'Intermediate'
      let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
      await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
        await app.kycMena.fillKYC(KYC_scorring)
      })
      await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
        expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
        expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
        await app.KYC_FinalStep.clickBtn('Deposit');  
      })
    })
  
    test('KYC Mena - Elementary Score', {tag:['@KYC_Mena','@mobile']}, async({app})=>{
      let KYC_scorring = 'Elementary'
      let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
      await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
        await app.kycMena.fillKYC(KYC_scorring)
      })
      await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
        expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Elementary");
        expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
        await app.KYC_FinalStep.clickBtn('Deposit');  
      })
    })
    test('KYC Mena - Beginner Score', {tag:['@KYC_Mena','@mobile']}, async({app})=>{
      let KYC_scorring = 'Beginner'
      let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
      await test.step(`User email - ${email}. Fill KYC- Beginner scorring`, async()=>{
        await app.kycMena.fillKYC(KYC_scorring)
      })
      await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
        expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Beginner");
        expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
        await app.KYC_FinalStep.clickBtn('Deposit');  
      })
    })
  })
  