import { expect } from "playwright/test";
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification";
import { getLocalization } from "../../pageObjects/localization/getText";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { test } from "..//..//test-options";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { KYC_Start } from "../../pageObjects/FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "../../pageObjects/FullRegistration/NagaMarkets_FullRegistration";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGAMarkets_PersonalInformation";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";

test.beforeEach("Naga Markets. KYC", async ({ page, NagaMarkets }, testInfo) => {
    await testInfo.setTimeout(testInfo.timeout + 120000);
    let signUp = new SignUp(page);
    let kycStart = new KYC_Start(page);
    let email = await new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user with ${email}`, async () => {
      await signUp.goto(NagaMarkets, 'register')
      await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', 'France');
    });
    await test.step("Phone verifiaction step", async () => {
      await new PersonalInformation(page).fillPersonalInformation('Verify with SMS')
      await new PhoneVerification(page).insertVerificationCode()
      await new YouAreInNagaMarkets(page).openNagaKyc()
      await kycStart.clickStartVerificationBtn()
    });
  }
);

test("@24921 Naga Markets. KYC - Advance level.",{tag:['@kyc', '@prodSanity','@smoke']}, async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_Advance = "Advance";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Advance} level`, async () => {
    await quiz.fill_KYC(KYC_Advance);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Advanced");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
    expect(await new MainPage(page).getMainPageBannerText()).toContain('Verify your identity')
  });
});

test("@24925 Naga Markets. KYC - PreAdvance level.",{tag:['@kyc']}, async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_PreAdvance = "PreAdvance";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_PreAdvance} level`, async () => {
    await quiz.fill_KYC(KYC_PreAdvance);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
    expect(await new MainPage(page).getMainPageBannerText()).toContain('Your account will be eligible for reassessment in 15 days')
})
})

test("@24920 Naga Markets. KYC - Intermediate level.", {tag:'@kyc'},async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent ="/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_Intermediate = "Intermediate";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Intermediate} level`, async () => {
    await quiz.fill_KYC(KYC_Intermediate);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
    expect(await new MainPage(page).getMainPageBannerText()).toContain('Your account will be eligible for reassessment in 15 days')
  });
});

test("@24923 Naga Markets. KYC - Elementary level.",
  {tag:'@kyc', annotation:{'description':'https://keywaygroup.atlassian.net/browse/RG-6937','type':'ticket'}}, 
    async ({page}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent ="/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let mainPageLocalization = "/pageObjects/localization/NagaMarkets_MainPage.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_Elementary = "Elementary";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Elementary} level`, async () => {
    await quiz.fill_KYC(KYC_Elementary);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUsersScorring()).toEqual("Elementary");
    expect(await localization.getLocalizationText("KYC_Elementary_Warning")).toContain(await KYC_FinalStep.getElementaryWarning());
    await KYC_FinalStep.clickCheckbox();
    expect(await localization.getLocalizationText("KYC_Elementary_Disclaimer")).toContain(await KYC_FinalStep.getElementaryDisclaimer());
    expect(await localization.getLocalizationText("KYC_Elementary_Description")).toContain(await KYC_FinalStep.getElementaryDescription());
    await KYC_FinalStep.clickFundAccount();
  });
});

test("@24922 Naga Markets. KYC - Beginner level.",{tag:['@kyc']}, async ({page}, testInfo) => {
  await testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent ="/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let mainPageLocalization ="/pageObjects/localization/NagaMarkets_MainPage.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_Beginner = "Beginner";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Beginner} level`, async () => {
    await quiz.fill_KYC(KYC_Beginner);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUserScorringText()).toContain("Beginner");
    expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await KYC_FinalStep.clickBtn('Deposit');
    expect(await new MainPage(page).getMainPageBannerText()).toContain('Your account will be eligible for reassessment in 15 days')
  });
});
