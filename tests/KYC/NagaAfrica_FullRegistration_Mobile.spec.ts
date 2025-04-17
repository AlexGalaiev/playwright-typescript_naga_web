import { expect } from "@playwright/test";
import { Captcha } from "../../pageObjects/captcha";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { KYC_Africa } from "../../pageObjects/FullRegistration/NagaAfrica_FullRegistrations";
import { FinalStep } from "../../pageObjects/FullRegistration/NAGAMarkets_KYCFinalStep";
import { getLocalization } from "../../pageObjects/localization/getText";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage";
import { test } from "../../test-options";


test.describe('KYC Mobile - Naga Africa', async()=>{
    let email = ''
    test.beforeEach('Create lead user', async({page, AppNAGA, NagaAfricaCountry}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 220000);
        let signUp = new SignUp(page)
        email = await new RandomUser().getRandomUserEmail()
        let KYC = new KYC_Africa(page)
        let mainPage = new MainPage(page)
        let myAccountsMenu = new MyAccounts(page)
        await test.step(`Create lead user with ${email}`, async()=>{
            await signUp.goto(AppNAGA, 'register')
            await new Captcha(page).removeCaptcha()
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', NagaAfricaCountry, '+387', '603039647')
            await new YouAreInNagaMarkets(page).clickOpenRealMoneyAccount()
        })
        await test.step(`Test fill NAGA Start information. User email ${email}`, async()=>{
            await KYC.fillStartInformation()
        })
        await test.step('Switch to main page and open kyc', async()=>{
            await mainPage.openBackMenuPoint('feed')
            await myAccountsMenu.openUserMenu();
            await myAccountsMenu.openMyAccountMenuItem('Profile Status')
            await mainPage.clickOnWidgepPoint('NAGA Progress')
            //await mainPage.removeNeedHelpBaloon()
            await KYC.waitNagaProgress()
        })
    })

    test(`@25366 Mobile view. KYC - Advance score. User email-${email}`,
        {tag:['@KYC_Africa','@mobile']},async({page})=>{
        let KYC = new KYC_Africa(page)
        let KYC_scorring = 'Advance'
        let KYC_FinalStep = new FinalStep(page);
        let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
        await test.step(`Test manually fill KYC - ${KYC_scorring} scorring, user-${email}`, async()=>{
            await KYC.fillKYC(KYC_scorring)
        })
        await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
            expect(await KYC_FinalStep.getUserScorringText()).toContain("Advanced");
            expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
            await KYC_FinalStep.clickBtn('Deposit');  
        })
    })
    test(`@25401 Mobile view. KYC - PreAdvance score. User email-${email}`,
        {tag:['@KYC_Africa', '@mobile']},async({page})=>{
        let KYC = new KYC_Africa(page)
        let KYC_scorring = 'PreAdvance'
        let KYC_FinalStep = new FinalStep(page);
        let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
        await test.step(`Test manually fill KYC - ${KYC_scorring} scorring, user-${email}`, async()=>{
            await KYC.fillKYC(KYC_scorring)
        })
        await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
            expect(await KYC_FinalStep.getUserScorringText()).toContain("Pre-Advanced");
            expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
            await KYC_FinalStep.clickBtn('Deposit');  
        })
    })
    test(`@25402 Mobile view. KYC - Intermediate score. User email-${email}`,
        {tag:['@KYC_Africa', '@mobile']},async({page})=>{
        let KYC = new KYC_Africa(page)
        let KYC_scorring = 'Intermediate'
        let KYC_FinalStep = new FinalStep(page);
        let localization = new getLocalization('/pageObjects/localization/NagaMarkets_KYC_localization.json');
        await test.step(`Test manually fill KYC - ${KYC_scorring} scorring, user-${email}`, async()=>{
            await KYC.fillKYC(KYC_scorring)
        })
        await test.step(`Assert scorring banner on final popup. Text must have - ${KYC_scorring} in header`, async()=>{
            expect(await KYC_FinalStep.getUserScorringText()).toContain("Intermediate");
            expect(await KYC_FinalStep.getPreAdvanceRiskWarning()).toEqual(await localization.getLocalizationText("KYC_PreAdvance_RiskDisclaimer"))
            await KYC_FinalStep.clickBtn('Deposit');  
        })
    })
})