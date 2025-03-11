import { expect } from "playwright/test"
import { Captcha } from "../../pageObjects/captcha"
import { StartKYCPopup } from "../../pageObjects/common/startKYC_Popup/startKYCPage"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "..//..//test-options"
import { MultiLicense } from "../../pageObjects/FullRegistration/Multilicence"

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
        await test.step(`Open KYC registration`, async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickExplorePlatform()
            await new MainPage(proxyPageBH).clickOnWidgepPoint('NAGA Start')
            await new StartKYCPopup(proxyPageBH).startKYC()
        })
    })

    test(`@25444 Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@web']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License ')
            await multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await multiLicense.CapitalKYC()).toBeVisible()
        })
    })
    test(`@25444 Mobile. Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@web']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License ')
            await multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await multiLicense.CapitalKYC()).toBeVisible()
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
        await test.step(`Open KYC registration`, async()=>{
            await new YouAreInNagaMarkets(proxyPageBH).clickExplorePlatform()
            await new MainPage(proxyPageBH).clickOnMobileWidget('NAGA Start')
            await new StartKYCPopup(proxyPageBH).startKYC()
        })
    })

    test(`@25444 Mobile Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@mobile']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License ')
            await multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await multiLicense.CapitalKYC()).toBeVisible()
        })
    })
    test(`@25444 Mobile. Mulilicence. KYC Capital`, {tag: ['@kyc', '@KYC_Capital', '@mobile']}, async({proxyPageBH})=>{
        let multiLicense = new MultiLicense(proxyPageBH)
        await test.step(`Check MultiLicence popup for user-${email}. Switch to KYC-Capital`, async()=>{
            expect(await multiLicense.getPopupName()).toEqual('Select Your Preferred License ')
            await multiLicense.chooseRegulation('NAGA CAPITAL')
            expect(await multiLicense.CapitalKYC()).toBeVisible()
        })
    })
})

