import { expect } from "playwright/test"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import {test} from "..//..//test-options"

test.describe('WEB', async()=>{

    type tradingTools = {
        brand: string,
        user: string
    }

    const tradingToolsParams: tradingTools[] = [
        {brand:'@Capital', user:'leadCapital@naga.com'},
        {brand:'@Markets', user:'leadMarkets@naga.com'},
        {brand:'@Mena', user:'leadMena@naga.com'},
        {brand:'@Africa', user:'leadAfrica@naga.com'},
    ]
    for(const{brand, user} of tradingToolsParams){
        test(`${brand} Trading tools. Trading sygnals`, {tag:['@UI', '@web']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform by ${user}`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await mainPage.checkExternalService('Trading Signals', '**/user/activity/trading_indicators/symbols')
                expect(await mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
                expect(await mainPage.checkTradingSymbolsIsVisible()).toBeTruthy()
            })
        })}

    for(const{brand, user} of tradingToolsParams){
        test(`${brand} Trading tools. Contest tab`, {tag:['@UI', '@web']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform by ${user}`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await mainPage.checkExternalService('Contests', '**/contest/public?all=true')
                expect(await mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
                expect(await mainPage.checkContestTabIsVisible()).toBeTruthy()
            })
        })}
    for(const{brand, user} of tradingToolsParams){
        test(`${brand} Trading tools. Market Buzz tab`, {tag:['@UI', '@web']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform by ${user}`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await mainPage.checkExternalService('Market Buzz', '**/trading_central/generate_page_url**')
                expect(await mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
                expect(await mainPage.checkMarketsBuzzIsVisible()).toBeTruthy()
            })
        })}
    for(const{brand, user} of tradingToolsParams){
        test(`${brand} Trading tools. Economic Calendar tab`, {tag:['@UI', '@web']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page)
            let mainPage = new MainPage(page)
            await test.step(`Login to platform by ${user}`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await mainPage.checkExternalService('Economic Calendar', '**/trading_central/generate_page_url?page=economic_calendar**')
                expect(await mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
            })
        })}
        
})