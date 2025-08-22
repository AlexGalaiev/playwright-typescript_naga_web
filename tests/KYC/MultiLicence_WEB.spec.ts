import { expect } from "playwright/test"
import { Captcha } from "../../pageObjects/captcha"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "../../test-options"

test.describe("Multi licence web", async()=>{
    let email =''

    test.beforeEach('Create lead user',async({appBH, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 30000);
        email = new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with email-${email}`, async()=>{
            await appBH.signUp.goto(AppNAGA, "register");
            await new Captcha(appBH.page).removeCaptcha()
            await appBH.signUp.createCFDUser(email, process.env.USER_PASSWORD || "", 'Bahrain','+387', '603039647');
        })
    })

    test.skip(`Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@web']}, async({appBH})=>{
        await test.step(`Open KYC registration`, async()=>{
            await appBH.youAreIn.clickExplorePlatform()
            await appBH.mainPage.clickOnWidgepPoint('NAGA Start')
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await appBH.multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await appBH.multiLicense.checkRegulation('NAGA CAPITAL')
            expect(await appBH.multiLicense.checkKYCTitle('Enter your information as it appears on your ID/Passport:')).toBeTruthy() 
        })
    })

    test.skip(`Mulilicence. KYC ADGM`, {tag: ['@kyc', '@KYC_Mena', '@web']}, async({appBH})=>{
        await test.step(`Open KYC registration`, async()=>{
            await appBH.youAreIn.clickExplorePlatform()
            await appBH.mainPage.clickOnWidgepPoint('NAGA Start')
        })
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-ADGM`, async()=>{
            expect(await appBH.multiLicense.getPopupName()).toEqual('Select Your Preferred License')
            await appBH.multiLicense.checkRegulation('NAGA FSRA')
            expect(await appBH.multiLicense.checkKYCTitle('Personal Details:')).toBeTruthy()        
        })
    })

    test.skip(`Open multilycence from different platfrorm places`, {tag:['@kyc', '@web']}, async({appBH}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 15000)
        await test.step('Open multilicence after click "Deposit now" btn', async()=>{
            await appBH.youAreIn.clickDepositNow()
            expect(await appBH.multiLicense.multiLycensePopup()).toBeTruthy()
        })
        await test.step('Click on manage funds -> deposit', async()=>{
            await appBH.mainPage.refreshPage()
            await appBH.mainPage.openBackMenuCategory('Manage Funds')
            await appBH.kycWidgetPopup.clickOnWidgetMenu('NAGA Start')
            expect(await appBH.multiLicense.multiLycensePopup()).toBeTruthy()
        })
    })
})