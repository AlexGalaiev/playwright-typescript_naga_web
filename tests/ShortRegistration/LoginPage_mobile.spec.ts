import { expect } from "@playwright/test"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts"
import { SignIn } from "../../pageObjects/SignIn/SignInPage"
import { test } from "../../test-options"
import { MainPage } from "../../pageObjects/MainPage/MainPage"

test.describe('Login Logout Mobile', async()=>{
    
    type testTypes = {
        testrailId: string;
        brand: string;
        email: string;
    }
    const testParams: testTypes[] = [
        { testrailId: "@23568", brand: '@Markets', email: "testLeadUser@i.ua"},
        { testrailId: "@23914", brand: '@Capital', email: "testLeadUser"},
        { testrailId: "@25359", brand: '@Mena', email: "testLeadUserMena"},
        { testrailId: "@25360", brand: '@Africa', email: "testLeadAfrica"}
    ]

    for(const {testrailId, brand, email} of testParams){
        test(`${testrailId} Mobile view. Login/logout to platform ${brand} by ${email}`, 
            {tag:['@login', '@mobile']}, async({page, AppNAGA})=>{
            let signIn = new SignIn(page);
            let mainPage = new MainPage(page)
            await test.step(`Login to ${brand} plarform by ${email} user`, async()=>{
                await signIn.goto(AppNAGA, 'login')
                await signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Log out from platform', async()=>{
                await mainPage.openMobileBackMenuPoint('Logout')
                await mainPage.acceptUserLogout()
                expect(await signIn.getLoginMainPageText()).toEqual("Sign in to NAGA!")
            })
        })
    }
})