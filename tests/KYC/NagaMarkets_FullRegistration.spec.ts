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

test.beforeEach("Naga Markets. KYC", async ({ page, NagaMarkets }, testInfo) => {
    await testInfo.setTimeout(testInfo.timeout + 120000);
    let signUp = new SignUp(page);
    let signIn = new SignIn(page);
    let mainpage = new MainPage(page);
    let verification = new PhoneVerification(page);
    let kycStart = new KYC_Start(page);
    let email = await signUp.createLeadUserApi("FR");
    await test.step(`Create lead user via API. Login by ${email} to platform`, async () => {
      await signIn.goto(NagaMarkets, "login");
      await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || "");
    });
    await test.step("Phone verifiaction step", async () => {
      await mainpage.clickUpgradeBtn();
      await kycStart.clickStartVerificationBtn();
      await verification.acceptPhoneNumber();
      await verification.MN_insertVerificationCode();
    });
  }
);

test("@24921 Naga Markets. KYC - Advance level.",{tag:['@smoke', '@kyc', '@prodSanity']}, async ({page}, testInfo) => {
  await testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_Advance = "Advance";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Advance} level`, async () => {
    await quiz.fill_KYC(KYC_Advance);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUsersScorring()).toEqual("Advanced");
    expect(await localization.getLocalizationText("KYC_Advance_Disclaimer")).toContain(await KYC_FinalStep.getDisclaimer());
    expect(await localization.getLocalizationText("KYC_AdvanceScorring_Footer_description")).toContain(await KYC_FinalStep.getDescription());
    expect(await KYC_FinalStep.getFundAccountText()).toContain(await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount"));
    await KYC_FinalStep.clickFundAccount();
  });
});

test("@24925 Naga Markets. KYC - PreAdvance level.",{tag:['@smoke', '@kyc']}, async ({page}, testInfo) => {
  await testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent = "/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_PreAdvance = "PreAdvance";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_PreAdvance} level`, async () => {
    await quiz.fill_KYC(KYC_PreAdvance);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUsersScorring()).toEqual("Pre-Advanced");
    expect(await localization.getLocalizationText("KYC_PreAdvance_Disclaimer")).toContain(await KYC_FinalStep.getPreAdvanceDisclaimer());
    expect(await localization.getLocalizationText("KYC_PreAdvance_Footer_quizWarning")).toContain(await KYC_FinalStep.getPreAdvanceWarning());
    expect(await localization.getLocalizationText("KYC_PreAdvance_Footer_description")).toContain(await KYC_FinalStep.getPreAdvanceDescription());
    expect(await KYC_FinalStep.getPreAdvanceFundAccount()).toContain(await localization.getLocalizationText("KYC_PreAdvance_Footer_fundaccount"));
    await KYC_FinalStep.clickFundAccount()});
});

test("@24920 Naga Markets. KYC - Intermediate level.", {tag:['@smoke', '@kyc']},async ({page}, testInfo) => {
  await testInfo.setTimeout(testInfo.timeout + 120000);
  let kycFinishContent ="/pageObjects/localization/NagaMarkets_KYC_localization.json";
  let quiz = new FullRegistration(page);
  let localization = new getLocalization(kycFinishContent);
  let KYC_Intermediate = "Intermediate";
  let KYC_FinalStep = new FinalStep(page);
  await test.step(`Fill KYC ${KYC_Intermediate} level`, async () => {
    await quiz.fill_KYC(KYC_Intermediate);
  });
  await test.step("Check KYC status. Check KYC finish popup texts", async () => {
    expect(await KYC_FinalStep.getUsersScorring()).toEqual("Intermediate");
    expect(await localization.getLocalizationText("KYC_Intermidiate_Warning")).toContain(await KYC_FinalStep.getIntermediateWarning());
    expect(await localization.getLocalizationText("KYC_Intermidiate_Disclaimer")).toContain(await KYC_FinalStep.getIntermediateDisclaimer());
    expect(await localization.getLocalizationText("KYC_Intermidiate_Desription")).toContain(await KYC_FinalStep.getIntermediateDescription());
    expect(await KYC_FinalStep.getIntermediateFundAcount()).toContain(await localization.getLocalizationText("KYC_Intermidiate_FundAccount"));
    await KYC_FinalStep.clickFundAccount();
  });
});

test("@24923 Naga Markets. KYC - Elementary level.",{tag:['@smoke', '@kyc']}, async ({page}, testInfo) => {
  await testInfo.setTimeout(testInfo.timeout + 120000);
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

test("@24922 Naga Markets. KYC - Beginner level.",{tag:['@smoke', '@kyc']}, async ({page}, testInfo) => {
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
    expect(await KYC_FinalStep.getUsersScorring()).toEqual("Beginner Account");
    expect(await localization.getLocalizationText("KYC_Beginer_warning")).toContain(await KYC_FinalStep.getBeginnerWarning());
    expect(await localization.getLocalizationText("KYC_Beginer_disclaimer")).toContain(await KYC_FinalStep.getBeginnerDisclaimer());
    expect(await localization.getLocalizationText("KYC_Beginer_fundAccount")).toContain(await KYC_FinalStep.getBeginnerDescription());
    await KYC_FinalStep.clickFundAccount();
  });
});
