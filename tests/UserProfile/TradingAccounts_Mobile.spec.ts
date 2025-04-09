import { expect } from "@playwright/test";
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser";
import { KYC_General } from "../../pageObjects/FullRegistration/NagaBrands_KycRegistrations";
import { AddAcountForm } from "../../pageObjects/UserProfile/AddTradingAccount";
import { test } from "../../test-options"
import { MyAccounts } from "../../pageObjects/MainPage/MyAccounts";
import { SignIn } from "../../pageObjects/SignIn/SignInPage";

test.describe('Mobile. Create second account', async()=>{

    test("@23922 Naga Capital. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let myAccountsMenu = new MyAccounts(page);
        let email = await new RandomUser().getRandomUserEmail()
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
            await myAccountsMenu.openUserMenu()
            await myAccountsMenu.openMobileMyAccountsMenuItem('Trading Accounts')
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
    test("@23600 Naga Markets. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let myAccountsMenu = new MyAccounts(page);
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
            await myAccountsMenu.openUserMenu()
            await myAccountsMenu.openMobileMyAccountsMenuItem('Trading Accounts')
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
    test("@25400 Naga Mena. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let myAccountsMenu = new MyAccounts(page);
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
            await myAccountsMenu.openUserMenu()
            await myAccountsMenu.openMobileMyAccountsMenuItem('Trading Accounts')
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
    test("@25400 Naga Africa. Create 2nd live account", {tag:['@secondAccount', '@mobile']}, 
        async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        let addAccount = new AddAcountForm(page);
        let myAccountsMenu = new MyAccounts(page);
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
            await myAccountsMenu.openUserMenu()
            await myAccountsMenu.openMobileMyAccountsMenuItem('Trading Accounts')
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
        test(`Switching between exist accounts on brand ${brand}`,{tag:['@secondAccount', '@mobile']}, 
            async({page, AppNAGA}, testInfo)=>{
        let signIn = new SignIn(page)
        let addAccount = new AddAcountForm(page)
        let myAccounts = new MyAccounts(page)
        await test.step(`Login to ${brand} plarform by ${user} user`, async()=>{
            await signIn.goto(AppNAGA, 'login')
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
        })
        await test.step('Open trading accounts menu and ', async()=>{
            await myAccounts.openUserMenu()
            await myAccounts.openMobileMyAccountsMenuItem('Trading Accounts')
            let loginAccuntId = await addAccount.getLoginedAccountId()
            await addAccount.clickAccount(loginAccuntId)
        })
    })

}})
