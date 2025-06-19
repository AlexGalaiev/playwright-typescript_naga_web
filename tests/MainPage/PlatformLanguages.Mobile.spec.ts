import { expect } from "@playwright/test"
import {test} from "../../test-options"
import { getLocalization } from "../../pageObjects/localization/getText"

test.describe('Mobile', async()=>{
    type language = {
        brand: string,
        languages: string[]
    }
    const languageParams: language[] = [
        {brand:'Markets', languages:['English','Español','Deutsch','Polski','Česky','Italiano','Magyar','Português','Română','汉语','繁體中文']}
    ]

    for(const{brand, languages} of languageParams){
    test(`${brand} Platform languages on guest mode`, {tag:['@UI', '@mobile']}, async({appIT, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        await test.step(`${brand} Open guest login page`, async()=>{
            await appIT.signUp.goto(AppNAGA, "feed")
        })
        await test.step('Choose language. And check btns localization. Also test checks popup title, and signIn, signUp btn', async()=>{
            let localBtn = await new getLocalization("/pageObjects/localization/Tutorial.json")
            for(let index in languages){
                await appIT.guestLogin.changeLaguageTo(languages[index])
                expect(await appIT.guestLogin.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))).toBeTruthy()
                expect(await appIT.guestLogin.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn2'))).toBeTruthy()
                await appIT.guestLogin.openTutorPopup(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))
                await appIT.guestLogin.openGuestLoginPage()
                expect(await appIT.guestLogin.getSignInBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signIn'))
                expect(await appIT.guestLogin.getSignUpBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signUp'))
            }})
    })}

    const languageParamsCapital: language[] = [
        {brand:'Capital', languages:['English','Español','Deutsch','Polski','Česky','Italiano','Magyar','Português','Română','汉语','繁體中文','العربية']}
    ]

    for(const{brand, languages} of languageParamsCapital){
    test(`${brand} Platform languages on guest mode`, {tag:['@UI', '@mobile']}, async({appUA, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        await test.step(`${brand} Open guest login page`, async()=>{
            await appUA.signUp.goto(AppNAGA, "feed")
        })
        await test.step('Choose language. And check btns localization. Also test checks popup title, and signIn, signUp btn', async()=>{
            let localBtn = await new getLocalization("/pageObjects/localization/Tutorial.json")
            for(let index in languages){
                await appUA.guestLogin.changeLaguageTo(languages[index])
                expect(await appUA.guestLogin.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))).toBeTruthy()
                expect(await appUA.guestLogin.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn2'))).toBeTruthy()
                await appUA.guestLogin.openTutorPopup(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))
                await appUA.guestLogin.openGuestLoginPage()
                expect(await appUA.guestLogin.getSignInBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signIn'))
                expect(await appUA.guestLogin.getSignUpBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signUp'))
            }})
    })}

    const languageParamsMena: language[] = [
        {brand:'Mena', languages:['English', 'العربية']}
    ]

    for(const{brand, languages} of languageParamsMena){
    test(`${brand} Platform languages on guest mode`, {tag:['@UI', '@mobile']}, async({appUAE, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 25000)
        await test.step(`${brand} Open guest login page`, async()=>{
            await appUAE.signUp.goto(AppNAGA, "feed")
        })
        await test.step('Choose language. And check btns localization. Also test checks popup title, and signIn, signUp btn', async()=>{
            let localBtn = await new getLocalization("/pageObjects/localization/Tutorial.json")
            for(let index in languages){
                await appUAE.guestLogin.changeLaguageTo(languages[index])
                expect(await appUAE.guestLogin.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))).toBeTruthy()
                expect(await appUAE.guestLogin.checkTutorPopupBtnIsVisible(await localBtn.getTutorialsBtn(brand, languages[index], 'btn2'))).toBeTruthy()
                await appUAE.guestLogin.openTutorPopup(await localBtn.getTutorialsBtn(brand, languages[index], 'btn1'))
                await appUAE.guestLogin.openGuestLoginPage()
                expect(await appUAE.guestLogin.getSignInBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signIn'))
                expect(await appUAE.guestLogin.getSignUpBtnText()).toEqual(await localBtn.getTutorialsBtn(brand, languages[index], 'signUp'))
            }})
    })}
})