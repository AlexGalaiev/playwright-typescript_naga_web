import { expect } from "@playwright/test"
import { GusetLogin } from "../../pageObjects/MainPage/GuestLogin"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "..//..//test-options"
import { getLocalization } from "../../pageObjects/localization/getText"

test.describe('WEB', async()=>{
    type language = {
        brand: string,
        languages: string[]
    }
    const languageParams: language[] = [
        {brand:'Markets', languages:['English','Español','Deutsch','Polski','Česky','Italiano','Magyar','Português','Română','汉语','繁體中文']}
    ]

    for(const{brand, languages} of languageParams){
    test(`${brand} Platform languages on guest mode`, {tag:['@UI', '@web']}, async({proxyPage, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 25000)
        let signUp = new SignUp(proxyPage)
        let guestPage = new GusetLogin(proxyPage)
        await test.step(`${brand} Open guest login page`, async()=>{
            await signUp.goto(AppNAGA, "feed")
        })
        await test.step('Choose language. And check btns localization. Also test checks popup title, and signIn, signUp btn', async()=>{
            let localBtn = await new getLocalization("/pageObjects/localization/Tutorial.json")
            for(let index in languages){
                await guestPage.changeLaguageTo(languages[index])
                expect(await guestPage.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))).toBeTruthy()
                expect(await guestPage.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn2'))).toBeTruthy()
                await guestPage.openTutorPopup(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))
                expect(await guestPage.checkTutorPopupTitleIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'title'))).toBeTruthy()
                await guestPage.openGuestLoginPage()
                expect(await guestPage.getSignInBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signIn'))
                expect(await guestPage.getSignUpBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signUp'))
            }})
    })}

    const languageParamsCapital: language[] = [
        {brand:'Capital', languages:['English','Español','Deutsch','Polski','Česky','Italiano','Magyar','Português','Română','汉语','繁體中文','العربية']}
    ]

    for(const{brand, languages} of languageParamsCapital){
    test(`${brand} Platform languages on guest mode`, {tag:['@UI', '@web']}, async({proxyPageUA, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 25000)
        let signUp = new SignUp(proxyPageUA)
        let guestPage = new GusetLogin(proxyPageUA)
        await test.step("@Capital Open guest login page", async()=>{
            await signUp.goto(AppNAGA, "feed")
        })
        await test.step('Choose language. And check btns localization. Also test checks popup title, and signIn, signUp btn', async()=>{
            let localBtn = await new getLocalization("/pageObjects/localization/Tutorial.json")
            for(let index in languages){
                await guestPage.changeLaguageTo(languages[index])
                expect(await guestPage.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))).toBeTruthy()
                expect(await guestPage.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn2'))).toBeTruthy()
                await guestPage.openTutorPopup(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))
                expect(await guestPage.checkTutorPopupTitleIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'title'))).toBeTruthy()
                await guestPage.openGuestLoginPage()
                expect(await guestPage.getSignInBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signIn'))
                expect(await guestPage.getSignUpBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signUp'))
            }})
    })}

    const languageParamsMena: language[] = [
        {brand:'Mena', languages:['English', 'العربية']}
    ]

    for(const{brand, languages} of languageParamsMena){
    test(`${brand} Platform languages on guest mode`, {tag:['@UI', '@web']}, async({proxyPageUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 25000)
        let signUp = new SignUp(proxyPageUAE)
        let guestPage = new GusetLogin(proxyPageUAE)
        await test.step("@Capital Open guest login page", async()=>{
            await signUp.goto(AppNAGA, "feed")
        })
        await test.step('Choose language. And check btns localization. Also test checks popup title, and signIn, signUp btn', async()=>{
            let localBtn = await new getLocalization("/pageObjects/localization/Tutorial.json")
            for(let index in languages){
                await guestPage.changeLaguageTo(languages[index])
                expect(await guestPage.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))).toBeTruthy()
                expect(await guestPage.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn2'))).toBeTruthy()
                await guestPage.openTutorPopup(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))
                expect(await guestPage.checkTutorPopupTitleIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'title'))).toBeTruthy()
                await guestPage.openGuestLoginPage()
                expect(await guestPage.getSignInBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signIn'))
                expect(await guestPage.getSignUpBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signUp'))
            }})
    })}
    
})