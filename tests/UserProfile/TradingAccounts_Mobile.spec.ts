import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { test } from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";

test.describe('Mobile. Create second account', async()=>{

    test("Naga Capital. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await app.KYC_Registration.NagaCapital_KYC_Mobile(
                email, 
                process.env.USER_PASSWORD || '', 
                'Bosnia and Herzegovina',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Trading Accounts')
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
    })
    test("Naga Markets. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await app.KYC_Registration.NagaMarkets_KYC_Advance(
                email, 
                process.env.USER_PASSWORD || '', 
                'France',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Trading Accounts')
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
    })
    test("Naga Mena. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await app.KYC_Registration.NagaMena_KYC_Mobile(
                email, 
                process.env.USER_PASSWORD || '',
                'United Arab Emirates',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Trading Accounts')
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
    })
    test("Naga Africa. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await app.KYC_Registration.NagaAfrica_KYC_Mobile(
                email, 
                process.env.USER_PASSWORD || '',
                'South Africa',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Trading Accounts')
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await app.addAccount.openMobileAccountCreateForm()
            await app.addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await app.addAccount.getMobileStatusMSG()).toEqual('Success')
            await app.addAccount.acceptPopup()
        })})
})

test.describe('Mobile. Actions with accounts', async()=>{
    
    type switchingActions = {
        brand: string,
        user: string,
    }
    const switchingParams: switchingActions[] = [
        {brand:'@Capital', user:'userWithAccounts@i.ua'},
        {brand:'@Markets', user:'userWithAccounts2@i.ua'},
        {brand:'@Mena', user:'userWithAccounts3@i.ua'},
        {brand:'@Africa', user:'userWithAccounts4@i.ua'}
    ]
    for(const{brand, user}of switchingParams){
        test(`Switching between exist accounts on brand ${brand}`,{tag:['@secondAccount', '@mobile']}, 
            async({app, AppNAGA})=>{
        await test.step(`Login to ${brand} plarform by ${user} user`, async()=>{
            await app.signIn.goto(AppNAGA, 'login')
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open trading accounts menu on main page.Check correct logined account', async()=>{
            await app.mainPage.openMobileBalanceMenu()
            await app.mainPage.chooseMobileTradingAccount('secondAccount')
            expect(await app.mainPage.getloginnedUserAccount()).toEqual('secondAccount')
        })
        await test.step('Switch to main account', async()=>{
            await app.mainPage.chooseMobileTradingAccount('mainAccount')
            expect(await app.mainPage.getloginnedUserAccount()).toEqual('mainAccount')
        })
    })}

    const editParams:switchingActions[] = [
        {brand:'@Capital', user:'leadUserCapital@naga.com'},
        {brand:'@Markets', user:'leadUserMarkets@naga.com'},
        {brand:'@Mena', user:'leadUserMena@naga.com'},
        {brand:'@Africa', user:'leadUserAfrica@naga.com'}
    ]
    for (const{brand, user}of editParams){
        test(`${brand} Edit trading account information `, 
            {tag:['@secondAccount','@mobile']}, async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 90000)
        await test.step(`Login to platform by ${user} to ${brand}`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('Change name of exist trading acoount', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Trading Accounts')
            await app.addAccount.openEditForm('NAGA - USD')
            await app.addAccount.changeMobileNameOfAccount('TestName')
            expect(await app.addAccount.getChangedName('TestName')).toBeTruthy()
        })
        await test.step('Move back name NAGA - USD', async()=>{
            await app.addAccount.openEditForm('TestName')
            await app.addAccount.changeMobileNameOfAccount('NAGA - USD')
        })})
    }
})
