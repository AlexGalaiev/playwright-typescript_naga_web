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
import { Captcha } from "..//..//pageObjects/captcha"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";

let email =''

test.beforeEach("Naga Mena. KYC", async ({ page, NagaMena }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 200000);
    let signUp = new SignUp(page);
    let kycStart = new KYC_Start(page);
    email = new RandomUser().getRandomUserEmail()
    let mainPage = new MainPage(page)
    await test.step(`Create lead user with ${email} via Short registration form`, async () => {
      await signUp.goto(NagaMena, "register");
      await new Captcha(page).removeCaptcha()
      await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || "", 'United Arab Emirates','+387', '603039647');
    });
    await test.step("Fill Personal information popup. Verify phone number with sms", async () => {
      await new PersonalInformation(page).fillPersonalInformation('Verify with SMS')
    })
    await test.step("Insert verification code. Wait for popup", async()=>{
      await new PhoneVerification(page).insertVerificationCode()
      await new YouAreInNagaMarkets(page).clickExplorePlatform()
    })
    await test.step('Click first step on main page', async()=>{
      await mainPage.clickOnWidgepPoint('Upgrade to Live')
      await kycStart.clickStartVerificationBtn()
    })
  })

  test('@25253 KYC Mena - Advance Score', {tag:['@kyc', '@prodSanity','@smoke']}, async({page})=>{
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Advance'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
    let mainPage = new MainPage(page)
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Advanced");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
    })
    await test.step('Switch to main page and assert that widget step has correct text in description', async()=>{
      await mainPage.openHeaderMenuPoint("feed");
      expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
    })
  })
  test('@25361 KYC Mena - PreAdvance Score', {tag:['@kyc']}, async({page})=>{
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'PreAdvance'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
    let mainPage = new MainPage(page)
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
    })
    await test.step('Switch to main page and assert that widget step has correct text in description', async()=>{
      await mainPage.openHeaderMenuPoint("feed");
      expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
    })
  })
  test('@25362 KYC Mena - Intermediate Score', {tag:['@kyc']}, async({page})=>{
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Intermediate'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
    let mainPage = new MainPage(page)
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
    })
    await test.step('Switch to main page and assert that widget step has correct text in description', async()=>{
      await mainPage.openHeaderMenuPoint("feed");
      expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
    })
  })

  test('@25363 KYC Mena - Elementary Score', {tag:['@kyc']}, async({page})=>{
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Elementary'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
    let mainPage = new MainPage(page)
    await test.step(`User email - ${email}. Fill KYC - ${KYC_scorring} scorring. Test manually click's answers in KYC`, async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Elementary");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
    })
    await test.step('Switch to main page and assert that widget step has correct text in description', async()=>{
      await mainPage.openHeaderMenuPoint("feed");
      expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
    })
  })
  test('@25364 KYC Mena - Beginner Score', {tag:['@kyc']}, async({page})=>{
    let kyc = new MenaFullRegistration(page)
    let KYC_scorring = 'Beginner'
    let KYC_FinalStep = new FinalStep(page);
    let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
    let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
    let mainPage = new MainPage(page)
    await test.step(`User email - ${email}. Fill KYC- Beginner scorring`, async()=>{
      await kyc.fillKYC(KYC_scorring)
    })
    await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
      expect(await KYC_FinalStep.getUserScorringText()).toContain("Beginner");
      expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
      await KYC_FinalStep.clickBtn('Deposit');  
    })
    await test.step('Switch to main page and assert that widget step has correct text in description', async()=>{
      await mainPage.openHeaderMenuPoint("feed");
      expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
    })
  })
