import { expect } from "playwright/test"
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
        test(`${brand} Trading tools. Trading sygnals`, {tag:['@UI', '@web']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await app.mainPage.checkExternalService('Trading Signals', '**/user/activity/trading_indicators/symbols')
                expect(await app.mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
                expect(await app.mainPage.checkTradingSymbolsIsVisible()).toBeTruthy()
            })
        })}

    type contestTab = {
        brand: string,
        user: string
    }

    const contestParams: contestTab[] = [
        {brand:'@Capital', user:'leadCapital@naga.com'},
        {brand:'@Africa', user:'leadAfrica@naga.com'}
    ]

    for(const{brand, user} of contestParams){
        test(`${brand} Trading tools. Contest tab`, {tag:['@UI', '@web']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await app.mainPage.checkExternalService('Contests', '**/contest/public?all=true')
                expect(await app.mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
                expect(await app.mainPage.checkContestTabIsVisible()).toBeTruthy()
            })
        })}

    for(const{brand, user} of tradingToolsParams){
        test(`${brand} Trading tools. Market Buzz tab`, {tag:['@UI', '@web']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await app.mainPage.checkExternalService('Market Buzz', '**/trading_central/generate_page_url**')
                expect(await app.mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
                expect(await app.mainPage.checkMarketsBuzzIsVisible()).toBeTruthy()
            })
        })}
    for(const{brand, user} of tradingToolsParams){
        test(`${brand} Trading tools. Economic Calendar tab`, {tag:['@UI', '@web']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform by ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            })
            await test.step('Check trading signals response', async()=>{
                let serviceStatus = await app.mainPage.checkExternalService('Economic Calendar', '**/trading_central/generate_page_url?page=economic_calendar**')
                expect(await app.mainPage.getServiceStatusCode(serviceStatus)).toEqual(200)
            })
        })}
})