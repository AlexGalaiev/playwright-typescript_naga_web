import { expect } from "@playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { Messanger } from "../../pageObjects/MainPage/Messanger"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import {test} from "../../test-options"

test.describe('WEB Messanger', async()=>{

    type testMessangertypes = {
        testRailId: string,
        brandSender: string,
        userSender: string,
        receiver: string 
       } 
    const testMessangerParams: testMessangertypes[] = [
        {testRailId: '@23615', brandSender: '@Markets', userSender: 'testTrading2Markets', receiver: 'testFeedUser'},
        {testRailId: '@25193', brandSender: '@Capital', userSender: 'testFeedUser', receiver:'testTrading2Markets'},
    ]
    for(const{testRailId, brandSender, userSender,receiver}of testMessangerParams){
        test(`${testRailId} ${brandSender} Send text via messanger`,{tag: ['@web','@messanger','@UI']}, async({page, proxyPage, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            let signInCapital = new SignIn(page)
            let signInMarkets = new SignIn(proxyPage)
            let mainPageCapital = new MainPage(page)
            let mainPageMarkets = new MainPage(proxyPage)
            let messangerCapital = new Messanger(page)
            let messangerMarkets = new Messanger(proxyPage)
            let randomText = await new RandomUser().randomUserName()
            await test.step(`Login by user ${userSender}`, async()=>{
                await signInMarkets.goto(AppNAGA, 'login')
                await signInMarkets.signInUserToPlatform(userSender, process.env.USER_PASSWORD || '')
            })
            await test.step(`Open messanger and send random text to ${receiver}`, async()=>{
                await mainPageMarkets.openMessangerViaHeader()
                await messangerMarkets.openPopupChatWithUser(receiver)
                await messangerMarkets.sendMessage(randomText)
                expect(await messangerMarkets.getMyLastMsgInChat(randomText)).toBeVisible()
            })
            await test.step(`Check message in ${receiver} messanger`,async()=>{
                await signInCapital.switchPage(page)
                await signInCapital.goto(AppNAGA, 'login')
                await signInCapital.signInUserToPlatform(receiver, process.env.USER_PASSWORD || '')
            })
            await test.step('Check message on receiver side', async()=>{
                await mainPageCapital.openMessangerViaHeader()
                await messangerCapital.openPopupChatWithUser(userSender)
                expect(await messangerCapital.getMyLastMsgInChat(randomText)).toBeVisible()
            })
        })
    }
})
test.describe('Mobile Messanger', async()=>{
    type testMessangertypes = {
        testRailId: string,
        brandSender: string,
        userSender: string,
        receiver: string 
       } 
    const testMessangerParams: testMessangertypes[] = [
        {testRailId: '@23615', brandSender: '@Markets', userSender: 'testTrading2Markets', receiver: 'testFeedUser'},
        {testRailId: '@25193', brandSender: '@Capital', userSender: 'testFeedUser', receiver:'testTrading2Markets'},
    ]
    for(const{testRailId, brandSender, userSender,receiver}of testMessangerParams){
        test(`${testRailId} ${brandSender} Mobile. Send text via messanger`,
            {tag: ['@mobile','@messanger','@UI']}, async({page, proxyPage, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            let signInCapital = new SignIn(page)
            let signInMarkets = new SignIn(proxyPage)
            let mainPageCapital = new MainPage(page)
            let mainPageMarkets = new MainPage(proxyPage)
            let messangerCapital = new Messanger(page)
            let messangerMarkets = new Messanger(proxyPage)
            let randomText = await new RandomUser().randomUserName()
            await test.step(`Login by user ${userSender}`, async()=>{
                await signInMarkets.goto(AppNAGA, 'login')
                await signInMarkets.signInUserToPlatform(userSender, process.env.USER_PASSWORD || '')
            })
            await test.step(`Open messanger and send random text to ${receiver}`, async()=>{
                await mainPageMarkets.openMessangerViaHeader()
                await messangerMarkets.openMobileChatWithUser(receiver)
                await messangerMarkets.sendMessage(randomText)
                expect(await messangerMarkets.getMyLastMsgInChat(randomText)).toBeVisible()
            })
            await test.step(`Check message in ${receiver} messanger`,async()=>{
                await signInCapital.switchPage(page)
                await signInCapital.goto(AppNAGA, 'login')
                await signInCapital.signInUserToPlatform(receiver, process.env.USER_PASSWORD || '')
            })
            await test.step('Check message on receiver side', async()=>{
                await mainPageCapital.openMessangerViaHeader()
                await messangerCapital.openMobileChatWithUser(userSender)
                expect(await messangerCapital.getMyLastMsgInChat(randomText)).toBeVisible()
            })
        })
    }
})