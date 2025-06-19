import { expect } from "@playwright/test"
import { test } from "../../test-options"


test.describe('Login Logout Mobile', async()=>{
    
    type testTypes = {
        brand: string;
        email: string;
    }
    const testParams: testTypes[] = [
        { brand: '@Markets', email: "testLeadUser@i.ua"},
        { brand: '@Capital', email: "testLeadUser"},
        { brand: '@Mena', email: "testLeadUserMena"},
        { brand: '@Africa', email: "testLeadAfrica"}
    ]

    for(const {brand, email} of testParams){
        test(`Mobile view. Login/logout to platform ${brand} by ${email}`, 
            {tag:['@login', '@mobile']}, async({app, AppNAGA})=>{
            await test.step(`Login to ${brand} plarform by ${email} user`, async()=>{
                await app.signIn.goto(AppNAGA, 'login')
                await app.signIn.signInUserToPlatform(email, process.env.USER_PASSWORD || '')
            })
            await test.step('Log out from platform', async()=>{
                await app.mainPage.openMobileBackMenuPoint('Logout')
                await app.mainPage.acceptUserLogout()
                expect(await app.signIn.getLoginMainPageText()).toEqual("Sign in to NAGA!")
            })
        })
}})