import { expect } from "playwright/test";
import { getLocalization } from "../../pageObjects/localization/getText";
import { test } from "..//..//test-options";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { Captcha } from "../../pageObjects/captcha";


test.describe('KYC', async()=>{
  let email=''
  let AML
  let Scoring
 
  test.beforeEach("Naga Markets. KYC", async ({ app, AppNAGA }, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 120000);
    email = await new RandomUser().getRandomUserEmail()
    await test.step(`Create lead user with ${email} on short registration form`, async () => {
      await app.signUp.goto(AppNAGA, 'register')
      await new Captcha(app.page).removeCaptcha()
      await app.signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', 'France', '+387', '603039647');
    });
    await test.step("Fill Personal information popup. Verify phone number with sms", async () => {
      await app.personalInformation.fillPersonalInformation('Verify with SMS')
    })
    await test.step("Verify phone number", async()=>{
      await app.phoneVerification.insertVerificationCode()
      await app.youAreIn.openNagaKyc()
      await app.kycStart.clickStartVerificationBtn()
    })}
)
test("Naga Markets. KYC - Advance level.",
  {tag:['@kyc', '@prodSanity','@smoke','@KYC_Markets','@mobile','@web']}, async ({app}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 130000);
  let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
  let KYC_Advance = "Advance";
  let scoring_AML = 0.54
  let scoring_General = 70.3
  await test.step(`User email - ${email}. Test manually fill KYC -  ${KYC_Advance} level`, async () => {
    await app.quiz.fill_KYC(KYC_Advance);
    [AML, Scoring] = await app.quiz.finishKycAndGetAML()
    expect(AML).toEqual(scoring_AML)
    expect(Scoring).toEqual(scoring_General)
  })
  await test.step(`AML = ${AML}, General Scoring = ${Scoring}. ${KYC_Advance} scorring must be in the header`, async () => {
    expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Advanced");
    expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await app.KYC_FinalStep.clickBtn('Deposit')
  })
})

test("Naga Markets. KYC - PreAdvance level.",
  {tag:['@kyc', '@KYC_Markets','@mobile','@web']}, async ({app}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 130000); 
  let localization = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json");
  let KYC_PreAdvance = "PreAdvance"
  let scoring_AML = 0.3375
  let scoring_General = 22.2
  await test.step(`User email - ${email}. Test manually fill KYC - ${KYC_PreAdvance} level`, async () => {
    await app.quiz.fill_KYC(KYC_PreAdvance);
    [AML, Scoring] = await app.quiz.finishKycAndGetAML()
    expect(AML).toEqual(scoring_AML)
    expect(Scoring).toEqual(scoring_General)
  });
  await test.step(`AML = ${AML}, General Scoring = ${Scoring}. ${KYC_PreAdvance} scorring must be in the header`, async () => {
    expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
    expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await app.KYC_FinalStep.clickBtn('Deposit');
  })
})

test("Naga Markets. KYC - Intermediate level.", 
  {tag:['@kyc', '@KYC_Markets','@mobile','@web']},async ({app}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let localization = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json");
  let KYC_Intermediate = "Intermediate"
  let scoring_AML = 0.27
  let scoring_General = 22
  await test.step(`User email - ${email}. Test manually fill KYC - ${KYC_Intermediate} level`, async () => {
    await app.quiz.fill_KYC(KYC_Intermediate);
    [AML, Scoring] = await app.quiz.finishKycAndGetAML()
    expect(AML).toEqual(scoring_AML)
    expect(Scoring).toEqual(scoring_General)
  });
  await test.step(`AML = ${AML}, General Scoring = ${Scoring}. ${KYC_Intermediate} scorring must be in the header`, async () => {
    expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
    expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await app.KYC_FinalStep.clickBtn('Deposit');
  })
});

test("Naga Markets. KYC - Elementary level.", 
  {tag:['@kyc', '@KYC_Markets', '@mobile','@web']}, 
    async ({app}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let localization = new getLocalization("/pageObjects/localization/NagaMarkets_KYC_localization.json");
  let KYC_Elementary = "Elementary";
  let scoring_AML = 0.2475
  let scoring_General = 8.2
  await test.step(`User email - ${email}. Test manually fill KYC -  ${KYC_Elementary} level`, async () => {
    await app.quiz.fill_KYC(KYC_Elementary);
    [AML, Scoring] = await app.quiz.finishKycAndGetAML()
    expect(AML).toEqual(scoring_AML)
    expect(Scoring).toEqual(scoring_General)
  });
  await test.step(`AML = ${AML}, General Scoring = ${Scoring}. ${KYC_Elementary} scorring must be in the header`, async () => {
    expect(await app.KYC_FinalStep.getUsersScorring()).toContain("Elementary");
    expect(await localization.getLocalizationText("KYC_Elementary_Warning")).toContain(await app.KYC_FinalStep.getElementaryWarning());
    await app.KYC_FinalStep.clickCheckbox();
    await app.KYC_FinalStep.clickBtn('Deposit');
  })
});

test("Naga Markets. KYC - Beginner level.",
  {tag:['@kyc', '@KYC_Markets','@mobile','@web']}, async ({app}, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 120000);
  let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
  let KYC_Beginner = "Beginner"
  let scoring_AML = 0.27
  let scoring_General = 12.6
  await test.step(`User email - ${email}. Fill KYC ${KYC_Beginner} level`, async () => {
    await app.quiz.fill_KYC(KYC_Beginner);
    [AML, Scoring] = await app.quiz.finishKycAndGetAML()
    expect(AML).toEqual(scoring_AML)
    expect(Scoring).toEqual(scoring_General)
  });
  await test.step(`AML = ${AML}, General Scoring = ${Scoring}. ${KYC_Beginner} scorring must be in the header`, async () => {
    expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Beginner");
    expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
    await app.KYC_FinalStep.clickBtn('Deposit');
  })
})
})


