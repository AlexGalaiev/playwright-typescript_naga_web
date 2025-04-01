import { expect } from "playwright/test"
import { Captcha } from "../../pageObjects/captcha"
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "..//..//test-options"
import { MultiLicense } from "../../pageObjects/FullRegistration/Multilicence"
import { Deposit } from "../../pageObjects/ManageFunds/Deposit"
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal"

test.describe("Multi licence web", async()=>{
    let email =''

    test.beforeEach('Create lead user',async({proxyPageBH, AppNAGA}, testInfo)=>{
        email = new RandomUser().getRandomUserEmail()
        let signUp = new SignUp(proxyPageBH)
        await test.step(`Create lead user with email-${email}`, async()=>{
            await signUp.goto(AppNAGA, "register");
            await new Captcha(proxyPageBH).removeCaptcha()
            await signUp.createCFDUser(email, process.env.USER_PASSWORD || "", 'Bahrain','+387', '603039647');
        })
    })

    test(`@25444 Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@web']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Open KYC registration`, async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickExplorePlatform()
            await new MainPage(proxyPageBH).clickOnWidgepPoint('NAGA Start')
            await new StartKYCPopup(proxyPageBH).startKYC()
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await multiLicense.CapitalKYC()).toBeVisible()
        })
    })
    test(`@25444 Mulilicence. KYC ADGM`, {tag: ['@kyc', '@KYC_Mena', '@web']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Open KYC registration`, async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickExplorePlatform()
            await new MainPage(proxyPageBH).clickOnWidgepPoint('NAGA Start')
            await new StartKYCPopup(proxyPageBH).startKYC()
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-ADGM`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await multiLicense.chooseRegulation('NAGA FSRA')
            expect(await multiLicense.ADGMKYC()).toBeVisible()
        })
    })
    test(`@25445 Open multilycence from different platfrorm places`, {tag:['@kyc', '@web']}, async({proxyPageBH}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000);
        let multiLicense = new MultiLicense(proxyPageBH)
        let mainPage = new MainPage(proxyPageBH)
        await test.step('Open multilicence after click "Deposit now" btn', async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickDepositNow()
            expect(await multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> deposit', async()=>{
            await mainPage.refreshPage()
            await mainPage.openBackMenuPoint('Manage Funds')
            await new Deposit(proxyPageBH).checkActiveDepositTab('deposit')
            await new Deposit(proxyPageBH).clickDepositMethod('Credit/Debit Cards')
            await new StartKYCPopup(proxyPageBH).startKYC()
            expect(await multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> Withdrawal', async()=>{
            await mainPage.refreshPage()
            await new Withdrawal(proxyPageBH).chooseWithdrawalMenu();
            await new StartKYCPopup(proxyPageBH).startKYC()
            expect(await multiLicense.multiLycensePopup()).toBeTruthy()
        })
    })
})
test.describe("Multi licence", async()=>{
    let email =''

    test.beforeEach('Create lead user',async({proxyPageBH, AppNAGA}, testInfo)=>{
        email = new RandomUser().getRandomUserEmail()
        let signUp = new SignUp(proxyPageBH)
        await test.step(`Create lead user with email-${email}`, async()=>{
            await signUp.goto(AppNAGA, "register");
            await new Captcha(proxyPageBH).removeCaptcha()
            await signUp.createCFDUser(email, process.env.USER_PASSWORD || "", 'Bahrain','+387', '603039647');
        })
    })

    test(`@25444 Mobile Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@mobile']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Open KYC registration`, async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickExplorePlatform()
            await new MainPage(proxyPageBH).clickOnMobileWidget('NAGA Start')
            await new StartKYCPopup(proxyPageBH).startKYC()
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await multiLicense.CapitalKYC()).toBeVisible()
        })
    })

    test(`@25444 Mobile. Mulilicence. KYC FSRA`, {tag: ['@kyc', '@KYC_Mena', '@mobile']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Open KYC registration`, async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickExplorePlatform()
            await new MainPage(proxyPageBH).clickOnMobileWidget('NAGA Start')
            await new StartKYCPopup(proxyPageBH).startKYC()
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await multiLicense.chooseRegulation('NAGA FSRA')
            expect(await multiLicense.ADGMKYC()).toBeVisible()
        })
    })
    
    test(`@25445 Mobile.Open multilycence from different platfrorm places`, {tag:['@kyc', '@mobile']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        let mainPage = new MainPage(proxyPageBH)
        await test.step('Open multilicence after click "Deposit now" btn', async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickDepositNow()
            expect(await multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> deposit', async()=>{
            await mainPage.refreshPage()
            await mainPage.openMobileMenu('Menu')
            await mainPage.openMobileBackMenuPoint('manage-funds')
            await new Deposit(proxyPageBH).checkActiveMobileManageTab('deposit')
            await new Deposit(proxyPageBH).clickMobileDepositMethod('Credit/Debit Cards')
            await new StartKYCPopup(proxyPageBH).startKYC()
            expect(await multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> Withdrawal', async()=>{
            await mainPage.refreshPage()
            await mainPage.openMobileMenu('Menu')
            await mainPage.openMobileBackMenuPoint('manage-funds')
            await new Deposit(proxyPageBH).checkActiveMobileManageTab('withdraw')
            await new StartKYCPopup(proxyPageBH).startKYC()
            expect(await multiLicense.multiLycensePopup()).toBeTruthy()
        })
    })

})

