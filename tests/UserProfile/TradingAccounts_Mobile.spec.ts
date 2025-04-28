import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { test } from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import { MainPage } from "../../pageObjects/MainPage/MainPage";

test.describe('Mobile. Create second account', async()=>{

    test("@23922 Naga Capital. Create 2nd live account", {tag:['@secondAccount', '@UI', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let myAccountsMenu = new MyAccounts(page);
        let email = await new RandomUser().getRandomUserEmail()
        let mainPage = new MainPage(page)
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await new KYC_General(page).NagaCapital_KYC_Mobile(
                email, 
                process.env.USER_PASSWORD || '', 
                'Bosnia and Herzegovina',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await mainPage.openMobileBackMenuPoint('Trading Accounts')
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
    })
    test("@23600 Naga Markets. Create 2nd live account", {tag:['@secondAccount', '@UI', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let mainPage = new MainPage(page);
        let email = await new RandomUser().getRandomUserEmail()
        
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await new KYC_General(page).NagaMarkets_KYC_Advance(
                email, 
                process.env.USER_PASSWORD || '', 
                'France',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await mainPage.openMobileBackMenuPoint('Trading Accounts')
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
    })
    test("@25400 Naga Mena. Create 2nd live account", {tag:['@secondAccount', '@UI', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let mainPage = new MainPage(page);
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await new KYC_General(page).NagaMena_KYC_Mobile(
                email, 
                process.env.USER_PASSWORD || '',
                'United Arab Emirates',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await mainPage.openMobileBackMenuPoint('Trading Accounts')
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
    })
    test("@25400 Naga Africa. Create 2nd live account", {tag:['@secondAccount', '@UI', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let mainPage = new MainPage(page);
        let email = await new RandomUser().getRandomUserEmail()
        
        await test.step(`Create lead user ${email} and finish KYC`, async()=>{
            await new KYC_General(page).NagaAfrica_KYC_Mobile(
                email, 
                process.env.USER_PASSWORD || '',
                'South Africa',
                '+387',
                '603039647',
                AppNAGA)
            })
        await test.step('Create 2nd live account', async()=>{
            await mainPage.openMobileBackMenuPoint('Trading Accounts')
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Live Account','Live_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
        })
        await test.step('Create 2nd demo account', async()=>{
            await addAccount.openMobileAccountCreateForm()
            await addAccount.createMobileAccount('Demo Account','Demo_USD', 'USD');
            expect(await addAccount.getMobileStatusMSG()).toEqual('Success')
            await addAccount.acceptPopup()
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
        test(`Switching between exist accounts on brand ${brand}`,{tag:['@secondAccount', '@UI', '@mobile']}, 
            async({page, AppNAGA}, testInfo)=>{
        let signIn = new SignIn(page)
        let mainPage = new MainPage(page)
        await test.step(`Login to ${brand} plarform by ${user} user`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open trading accounts menu on main page.Check correct logined account', async()=>{
            await mainPage.openMobileBalanceMenu()
            await mainPage.chooseMobileTradingAccount('secondAccount')
            expect(await mainPage.getloginnedUserAccount()).toEqual('secondAccount')
        })
        await test.step('Switch to main account', async()=>{
            await mainPage.chooseMobileTradingAccount('mainAccount')
            expect(await mainPage.getloginnedUserAccount()).toEqual('mainAccount')
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
            {tag:['@secondAccount','@UI', '@mobile']}, async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 90000);
        let signIn = new SignIn(page);
        let myAccountsMenu = new MyAccounts(page)
        let addAccountForm = new AddAcountForm(page)
        let mainPage = new MainPage(page)
        await test.step(`Login to platform by ${user} to ${brand}`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
        })
        await test.step('Change name of exist trading acoount', async()=>{
            await mainPage.openMobileBackMenuPoint('Trading Accounts')
            await addAccountForm.openEditForm('NAGA - USD')
            await addAccountForm.changeMobileNameOfAccount('TestName')
            expect(await addAccountForm.getChangedName('TestName')).toBeTruthy()
        })
        await test.step('Move back name NAGA - USD', async()=>{
            await addAccountForm.openEditForm('TestName')
            await addAccountForm.changeMobileNameOfAccount('NAGA - USD')
        })
    })
    }

})
