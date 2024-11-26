import { expect } from "@playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { MainPage } from "../../pageObjects/MainPage/MainPage"
import { Messanger } from "../../pageObjects/MainPage/Messanger"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import {test} from "../../test-options"

test.describe('Main page elements. Messanger', async()=>{

    type testMessangertypes = {
        testRailId: string,
        brandSender: string,
        userSender: string,
        receiver: string,
        brandReceiver: string
    } 
    const testMessangerParams: testMessangertypes[] = [
        {testRailId: '@23615', brandSender: '@NM', userSender: 'testTrading2Markets', receiver: 'testFeedUser', brandReceiver: '@NS'},
        {testRailId: '@25193', brandSender: '@NS', userSender: 'testFeedUser', receiver:'testTrading2Markets', brandReceiver: '@NM'},
    ]
    for(const{testRailId, brandSender, userSender,receiver, brandReceiver}of testMessangerParams){
        test(`${testRailId} ${brandSender} Send text via messanger`, async({page})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page)
            let messanger = new Messanger(page)
            let randomText = await new RandomUser().randomUserName()
            await test.step(`Login by user ${userSender}`, async()=>{
                await signIn.goto(await signIn.chooseBrand(brandSender), 'login')
                await signIn.signInUserToPlatform(userSender, process.env.USER_PASSWORD || '')
            })
            await test.step(`Open messanger and send random text to ${receiver}`, async()=>{
                await mainPage.openBackMenuPoint('Messenger')
                await messanger.openInboxTab()
                await messanger.chooseChat(receiver)
                await messanger.sendMessage(randomText)
                expect(await messanger.getMyLastMsgInChat(randomText)).toBeVisible()
            })
            await test.step(`Check message in ${receiver} messanger`,async()=>{
                await signIn.goto(await signIn.chooseBrand(brandReceiver), 'login')
                await signIn.signInUserToPlatform(receiver, process.env.USER_PASSWORD || '')
            })
            await test.step('Check message on receiver side', async()=>{
                await mainPage.openBackMenuPoint('Messenger')
                await messanger.openInboxTab()
                await messanger.chooseChat(userSender)
                expect(await messanger.getMyLastMsgInChat(randomText)).toBeVisible()
            })
        })
    }
})