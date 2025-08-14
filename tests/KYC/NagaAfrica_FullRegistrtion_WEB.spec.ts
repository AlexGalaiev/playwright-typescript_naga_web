import { Captcha } from "../../pageObjects/captcha"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "../../test-options"
import { expect } from "@playwright/test"
import { getLocalization } from "../../pageObjects/localization/getText"

test.describe('KYC WEB. Naga Africa', async()=>{
    let email = ''
    let AML
    let Scoring     

    test.beforeEach('Create lead user', async({app, AppNAGA, NagaAfricaCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 220000);
        email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with ${email}`, async()=>{
            await app.signUp.goto(AppNAGA, 'register')
            await new Captcha(app.page).removeCaptcha()
            await app.signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', NagaAfricaCountry, '+387', '603039647')
            await app.youAreIn.clickOpenRealMoneyAccount()
        })
        await test.step(`Test fill NAGA Start information. User email ${email}`, async()=>{
            await app.kycAfrica.fillStartInformation()
        })
        await test.step('Switch to main page and open kyc', async()=>{
            await app.mainPage.closeManageFundsPopup()
            await app.mainPage.openBackMenuPoint('feed')
            await app.mainPage.clickOnWidgepPoint('NAGA Progress')
           // await app.kycAfrica.waitNagaProgress()
        })
    })

    test(`NagaAfrica -  Advance score. User email-${email}`,
        {tag:['@kyc', '@prodSanity','@KYC_Africa','@web']},async({app})=>{
        let KYC_scorring = 'Advance'
        let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json')
        let scoring_AML = 1.395
        let scoring_General = 0.96
        await test.step(`Test manually fill KYC - ${KYC_scorring} scorring, user-${email}`, async()=>{
            await app.kycAfrica.fillKYC(KYC_scorring);
            [AML, Scoring] = await app.kycMena.finishKycAndGetAML()
            expect(AML).toEqual(scoring_AML)
            expect(Scoring).toEqual(scoring_General)
        })
        await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
            expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Advanced");
            expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
            await app.KYC_FinalStep.clickBtn('Fund your Account');  
        })
    })

    test(`NagaAfrica - PreAdvance score. User email-${email}`,
        {tag:['@kyc', '@KYC_Africa','@web']}, async({app})=>{
        let KYC_scorring = 'PreAdvance'
        let scoring_AML = 1.215
        let scoring_General = 0.2
        let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
        await test.step(`Test manually fill KYC - ${KYC_scorring} scorring, user-${email}`, async()=>{
            await app.kycAfrica.fillKYC(KYC_scorring);
            [AML, Scoring] = await app.kycAfrica.finishKycAndGetAML()
            expect(AML).toEqual(scoring_AML)
            expect(Scoring).toEqual(scoring_General)
        })
        await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
            expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
            expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
            await app.KYC_FinalStep.clickBtn('Fund your Account');  
        })
    })
    test(`Naga Africa - Intermediate score. User email-${email}`,
        {tag:['@kyc', '@KYC_Africa','@web']},async({app})=>{
        let KYC_scorring = 'Intermediate'
        let scoring_AML = 0.945
        let scoring_General = 0
        let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
        await test.step(`Test manually fill KYC - ${KYC_scorring} scorring, user-${email}`, async()=>{
            await app.kycAfrica.fillKYC(KYC_scorring);
            [AML, Scoring] = await app.kycAfrica.finishKycAndGetAML()
            expect(AML).toEqual(scoring_AML)
            expect(Scoring).toEqual(scoring_General)
        })
        await test.step(`AML-${AML}, Scoring-${Scoring}. ${KYC_scorring} text in header`, async()=>{
            expect(await app.KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
            expect(await app.KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
            await app.KYC_FinalStep.clickBtn('Fund your Account');  
        })
    })
})

