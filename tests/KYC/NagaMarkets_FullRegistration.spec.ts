import { expect } from "playwright/test";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { test } from "..//..//test-options";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "../../pageObjects/FullRegistration/NagaMarkets_FullRegistration";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { Captcha } from "../../pageObjects/captcha";

test.beforeEach("Naga Markets. KYC", async ({ page, NagaMarkets }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 120000);
    let signUp = new SignUp(page);
    let kycStart = new KYC_Start(page);
    let email = await new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user with ${email} on short registration form`, async () => {
      await signUp.goto(NagaMarkets, 'register')
      await new Captcha(page).removeCaptcha()
      await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', 'France', '+387', '603039647');
    });
    await test.step("Fill Personal information popup. Verify phone number with sms", async () => {
      await new PersonalInformation(page).fillPersonalInformation('Verify with SMS')
      await new PhoneVerification(page).insertVerificationCode()
      await new YouAreInNagaMarkets(page).openNagaKyc()
      await kycStart.clickStartVerificationBtn()
    });
  }
);

test("@24921 Naga Markets. KYC - Advance level.",{tag:['@kyc', '@prodSanity','@smoke']}, 
  async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
  let quiz = new FullRegistration(page);
  let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
  let KYC_Advance = "Advance";
  let KYC_FinalStep = new FinalStep(page);
  let mainPage = new MainPage(page)
  await test.step(`Test manually fill KYC -  ${KYC_Advance} level`, async () => {
    await quiz.fill_KYC(KYC_Advance);
  });
  await test.step(`Check final KYC Popup. ${KYC_Advance} scorring must be in the header`, async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Advanced");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit')
  })
  await test.step('Switch to main page, and check status of main page widget step', async()=>{
    await mainPage.openHeaderMenuPoint("feed");
    expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
  })
});

test("@24925 Naga Markets. KYC - PreAdvance level.",{tag:['@kyc']}, async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000); 
  let mainPageLocalization = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
  let quiz = new FullRegistration(page);
  let localization = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json");
  let KYC_PreAdvance = "PreAdvance";
  let KYC_FinalStep = new FinalStep(page);
  let mainPage = new MainPage(page)
  await test.step(`Test manually fill KYC - ${KYC_PreAdvance} level`, async () => {
    await quiz.fill_KYC(KYC_PreAdvance);
  });
  await test.step(`Check final KYC Popup. ${KYC_PreAdvance} scorring must be in the header`, async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
  })
  await test.step('Switch to main page, and check status of main page widget step', async()=>{
    await mainPage.openHeaderMenuPoint("feed");
    expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
  })
})

test("@24920 Naga Markets. KYC - Intermediate level.", {tag:'@kyc'},async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let mainPageLocalization = new getLocalization('/pageObjects/localization/NagaMarkets_MainPage.json')
  let quiz = new FullRegistration(page);
  let localization = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json");
  let KYC_Intermediate = "Intermediate";
  let KYC_FinalStep = new FinalStep(page);
  let mainPage = new MainPage(page)
  await test.step(`Test manually fill KYC - ${KYC_Intermediate} level`, async () => {
    await quiz.fill_KYC(KYC_Intermediate);
  });
  await test.step(`Check final KYC Popup. ${KYC_PreAdvance} scorring must be in the header`, async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
  })
  await test.step('Switch to main page, and check status of main page widget step', async()=>{
    await mainPage.openHeaderMenuPoint("feed");
    expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
  })
});

test("@24923 Naga Markets. KYC - Elementary level.",
  {tag:'@kyc', annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-6937','type':'ticket'}}, 
    async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let quiz = new FullRegistration(page);
  let localization = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json");
  let mainPageLocalization = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
  let KYC_Elementary = "Elementary";
  let KYC_FinalStep = new FinalStep(page);
  let mainPage = new MainPage(page)
  await test.step(`Test manually fill KYC -  ${KYC_Elementary} level`, async () => {
    await quiz.fill_KYC(KYC_Elementary);
  });
  await test.step(`Check final KYC Popup. ${KYC_Elementary} scorring must be in the header`, async () => {
    expect(await KYC_FinalStep.getUsersScorring()).toContain("Elementary");
    expect(await localization.getLocalizationText("KYC_Elementary_Warning")).toContain(await KYC_FinalStep.getElementaryWarning());
    await KYC_FinalStep.clickCheckbox();
    await KYC_FinalStep.clickBtn('Deposit');
  })
  await test.step('Switch to main page, and check status of main page widget step', async()=>{
      await mainPage.openHeaderMenuPoint("feed");
      expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
  })
});

test("@24922 Naga Markets. KYC - Beginner level.",{tag:['@kyc']}, async ({page}, testInfo) => {
  await testInfo.setTimeout(testInfo.timeout + 120000);
  let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
  let mainPageLocalization = new getLocalization("/pageObjects/localization/NagaMarkets_MainPage.json")
  let quiz = new FullRegistration(page);
  let mainPage = new MainPage(page)
  let KYC_Beginner = "Beginner";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Beginner} level`, async () => {
    await quiz.fill_KYC(KYC_Beginner);
  });
  await test.step(`Check final KYC Popup. ${KYC_Beginner} scorring must be in the header`, async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Beginner");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
  })
  await test.step('Switch to main page, and check status of main page widget step', async()=>{
    await mainPage.openHeaderMenuPoint("feed");
    expect(await mainPage.getKYCbannerText()).toEqual(await mainPageLocalization.getLocalizationText('KYC_AdvanceBanner'))
})
})
