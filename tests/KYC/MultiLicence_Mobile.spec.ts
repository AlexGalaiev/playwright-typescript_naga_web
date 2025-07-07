import { expect } from "@playwright/test"
import { Captcha } from "../../pageObjects/captcha"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { test } from "../../test-options"

test.describe("Multi licence Mobile", async()=>{
    let email =''

    test.beforeEach('Create lead user',async({appBH, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 15000);
        email = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with email-${email}`, async()=>{
            await appBH.signUp.goto(AppNAGA, "register");
            await new Captcha(appBH.page).removeCaptcha()
            await appBH.signUp.createCFDUser(email, process.env.USER_PASSWORD || "", 'Bahrain','+387', '603039647');
        })
    })

    test(`Mobile Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@mobile']}, async({appBH})=>{
        await test.step(`Open KYC registration`, async()=>{
            await appBH.youAreIn.clickExplorePlatform()
            await appBH.mainPage.clickOnMobileWidget('NAGA Start')
            await appBH.kycStartPopup.startKYC()
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await appBH.multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await appBH.multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await appBH.multiLicense.CapitalKYC()).toBeVisible()
        })
    })

    test(`Mobile. Mulilicence. KYC FSRA`, {tag: ['@kyc', '@KYC_Mena', '@mobile']}, async({appBH})=>{
        await test.step(`Open KYC registration`, async()=>{
            await appBH.youAreIn.clickExplorePlatform()
            await appBH.mainPage.clickOnMobileWidget('NAGA Start')
            await appBH.kycStartPopup.startKYC()
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await appBH.multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await appBH.multiLicense.chooseRegulation('NAGA FSRA')
            expect(await appBH.multiLicense.ADGMKYC()).toBeVisible()
        })
    })
    
    test(`Mobile.Open multilycence from different platfrorm places`, {tag:['@kyc', '@mobile']}, async({appBH})=>{
        await test.step('Open multilicence after click "Deposit now" btn', async()=>{
            await appBH.youAreIn.clickDepositNow()
            expect(await appBH.multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> deposit', async()=>{
            await appBH.mainPage.refreshPage()
            await appBH.mainPage.openMobileMenu('Menu')
            await appBH.mainPage.openMobileBackMenuPoint('manage-funds')
            await appBH.deposit.checkActiveMobileManageTab('deposit')
            await appBH.deposit.clickMobileDepositMethod('Credit/Debit Cards')
            await appBH.kycStartPopup.startKYC()
            expect(await appBH.multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> Withdrawal', async()=>{
            await appBH.mainPage.refreshPage()
            await appBH.mainPage.openMobileMenu('Menu')
            await appBH.mainPage.openMobileBackMenuPoint('manage-funds')
            await appBH.deposit.checkActiveMobileManageTab('withdraw')
            await appBH.kycStartPopup.startKYC()
            expect(await appBH.multiLicense.multiLycensePopup()).toBeTruthy()
        })
    })

})