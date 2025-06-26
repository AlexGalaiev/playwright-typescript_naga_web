import { expect } from "@playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
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
        test(`${testRailId} ${brandSender} Send text via messanger`,{tag: ['@web','@messanger']}, async({app,appIT, proxyPage, AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            let randomText = await new RandomUser().randomUserName()
            await test.step(`Login by user ${userSender}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await appIT.signIn.signInUserToPlatform(userSender, process.env.USER_PASSWORD || '')
            })
            await test.step(`Open messanger and send random text to ${receiver}`, async()=>{
                await appIT.mainPage.openMessangerViaHeader()
                await appIT.messanger.openPopupChatWithUser(receiver)
                await appIT.messanger.sendMessage(randomText)
                expect(await appIT.messanger.getMyLastMsgInChat(randomText)).toBeVisible()
            })
            await test.step(`Check message in ${receiver} messanger`,async()=>{
                await app.signIn.switchPage()
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(receiver, process.env.USER_PASSWORD || '')
            })
            await test.step('Check message on receiver side', async()=>{
                await app.mainPage.openMessangerViaHeader()
                await app.messanger.openPopupChatWithUser(userSender)
                expect(await app.messanger.getMyLastMsgInChat(randomText)).toBeVisible()
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
            {tag: ['@mobile','@messanger']}, async({app, appIT,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 30000)
            let randomText = await new RandomUser().randomUserName()
            await test.step(`Login by user ${userSender}`, async()=>{
                await appIT.signIn.goto(AppNAGA, 'login')
                await appIT.signIn.signInUserToPlatform(userSender, process.env.USER_PASSWORD || '')
            })
            await test.step(`Open messanger and send random text to ${receiver}`, async()=>{
                await appIT.mainPage.openMessangerViaHeader()
                await appIT.messanger.openMobileChatWithUser(receiver)
                await appIT.messanger.sendMessage(randomText)
                expect(await appIT.messanger.getMyLastMsgInChat(randomText)).toBeVisible()
            })
            await test.step(`Check message in ${receiver} messanger`,async()=>{
                await app.signIn.switchPage()
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(receiver, process.env.USER_PASSWORD || '')
            })
            await test.step('Check message on receiver side', async()=>{
                await app.mainPage.openMessangerViaHeader()
                await app.messanger.openMobileChatWithUser(userSender)
                expect(await app.messanger.getMyLastMsgInChat(randomText)).toBeVisible()
            })
        })
    }
})