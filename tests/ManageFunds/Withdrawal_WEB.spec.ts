import { expect } from "@playwright/test";
import { MainPage } from "../../pageObjects/MainPage/MainPage";
import { Withdrawal } from "../../pageObjects/ManageFunds/Withdrawal"
import { SignIn } from "../../pageObjects/SignIn/SignInPage";
import {test} from "../../test-options"
import { getLocalization } from "../../pageObjects/localization/getText";
import { Deposit } from "../../pageObjects/ManageFunds/Deposit";

test.describe("Withdrawal Capital", async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    let amountValueToWithrawal = '55'

    test.beforeEach("Login by trade user", async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let signIn = new SignIn(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })
    
    test.fixme("@24097 Withdrawal via credit card", 
        {tag:['@withdrawal', '@manageFunds'], 
            annotation:{'description':'Cannot open withdrawal','type':'configuration issue'}}, async({page})=>{
        let withdrawal = new Withdrawal(page);
        await test.step('Make withdrawal via credit card', async()=>{
            await withdrawal.clickMenuPoint('Credit Card');
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await withdrawal.getWithdrawalAmountValue()).toContain(amountValueToWithrawal);
        })
        await test.step("Check withdrawal params", async()=>{
            let responseTitle = await withdrawal.checkWithdrawalRequest()
            expect(await withdrawal.getTitleOfCashierName()).toContain('Credit Card')
            expect(await withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })
    test("@24932 Withdrawal validation rulls", {tag:['@withdrawal', '@manageFunds','@web']},async({page})=>{
        let withdrawal = new Withdrawal(page);
        let valueToWithrawal = '1'
        await test.step('Open withdrawal menu', async()=>{
            await new MainPage(page).openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
        })
        await test.step('Input NOT valid amount for withdrawal', async()=>{
            await withdrawal.clickMenuPoint('Credit Card');
            await withdrawal.inputAmountWithdrawal(valueToWithrawal);
            expect(await withdrawal.getErrorText()).toContain("Amount has to be greater than or equal to")
        });
        await test.step("Open modal popup for cc cashier", async()=>{
            await withdrawal.openModalCCPopup();
            expect(await withdrawal.checkModalPopup()).toBeVisible()
        })
    });

    test("@24091 Crypto withdrawal", {tag:['@withdrawal', '@manageFunds','@web']},async({page})=>{
        let withdrawal = new Withdrawal(page);
        let localization = new getLocalization(ManageFunds_Withdrawal);
        await test.step('Open withdrawal menu', async()=>{
            await new MainPage(page).openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
        })
        await test.step("Make crypto withdrawal", async()=>{
            await withdrawal.clickMenuPoint('Crypto')
            await withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await withdrawal.clickWithdrawBtn();
        })
        await test.step("Check crypto wallet popup", async()=>{
            expect(await withdrawal.checkCryptoPopup()).toBeVisible()
            expect(await withdrawal.checkCryptoPopupHeaderText()).toEqual('Withdraw to Crypto')
            await withdrawal.performCryptoWithdrawalToTestAccount();
        })
        await test.step('Check crypto withdrawal success popup', async()=>{
            expect(await withdrawal.checkCryptoWithdrawalSuccessPopup()).toBeTruthy()
            expect(await withdrawal.checkCryptoSuccessPopupText()).toEqual(await localization.getLocalizationText("CryptoWithdrawalSuccessPopupText"))
        })
    })
})

test.describe('Withdrawal Markets', async()=>{
    test("@24093 PayPal withdrawal", {tag:['@withdrawal', '@manageFunds','@web']},async({page, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page)
        let amountValueToWithrawal = 100
        await test.step('Login by depositTestMarkets3 to NagaMarkets and open withdrawal', async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform("depositTestMarkets3", process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
        await test.step('Open Pay pal withdrawal', async()=>{
            await withdrawal.clickMenuPoint('PayPal')
            let response = await withdrawal.performManualWithdrawal(amountValueToWithrawal, '**/payment/paypal/withdraw')
            expect(await withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
            expect(await withdrawal.getAPIWithdrawalAmount(response)).toEqual(amountValueToWithrawal)
        })
    })
})

test.describe('Withdrawal. All brands', async()=>{

type NS_WithdrawalTypes = {
    testRailId: string,
    brand: string,
    user: string,
    menuPoint: string,
    paymentMethod: string,
    responsePaymentMethod: string
}
const NS_WithdrawalParams: NS_WithdrawalTypes[] = [
    {testRailId: '@24098', brand: '@Capital', user: 'testWithdrawal@i.ua', menuPoint: 'eWallet', paymentMethod: 'neteller', responsePaymentMethod:'altneteller'},
    {testRailId: '@24095', brand: '@Capital', user: 'testWithdrawal2@i.ua', menuPoint: 'eWallet', paymentMethod: 'skrill', responsePaymentMethod:'skrill'},
]
//difference between NagaMarkets and NagaCapital -> Markets has withdrawal popup, Capital opens iframe
for(const{testRailId, brand, user, menuPoint, paymentMethod, responsePaymentMethod}of NS_WithdrawalParams){
    test(`${testRailId} ${brand} EWallet withdrawals. Check ${paymentMethod} withdrawal`, 
        {tag: ["@withdrawal", '@prodSanity', '@manageFunds','@web']}, async({page,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        await test.step(`Login by ${user} to ${brand} platform and open withdrawal`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
        await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
            await withdrawal.clickMenuPoint(menuPoint)
            await withdrawal.clickPaymentMethod(paymentMethod)
            let amount = await withdrawal.withdrawalCalculation('$')
            let response = await withdrawal.performManualWithdrawal(amount, '**/api/cashier/get-gateway-list-without-details')
            expect(await withdrawal.getApiPaymentMethodKey(response)).toEqual(responsePaymentMethod)
            expect(await withdrawal.getApiStatusCode(response)).toEqual(200)
        })
    })
}

//difference between NagaMarkets and NagaCapital -> Markets has withdrawal popup, Capital opens iframe
type NM_WithdrawalTypes = {
    testRailId: string,
    brand: string,
    user: string,
    menuPoint: string,
    paymentMethod: string,
    withdrawalPageTitle: string
}
const NM_WithdrawalParams: NM_WithdrawalTypes[] = [
    {testRailId: '@25156', brand: '@Markets', user: 'depositTestMarkets', menuPoint: 'eWallet', paymentMethod: 'sofort', withdrawalPageTitle: 'Neteller'},
    {testRailId: '@25157', brand: '@Markets', user: 'depositTestMarkets1', menuPoint: 'eWallet', paymentMethod: 'giropay', withdrawalPageTitle: 'Skrill'},
    {testRailId: '@25158', brand: '@Markets', user: 'depositTestMarkets2', menuPoint: 'eWallet', paymentMethod: 'webmoney', withdrawalPageTitle: 'Perfect Money'}
]
for(const{testRailId, brand, user, menuPoint, paymentMethod,withdrawalPageTitle} of NM_WithdrawalParams){
    test(`${testRailId} ${brand} Ewallet withdrawal. Check ${withdrawalPageTitle} withdrawal`, 
        {tag: ["@withdrawal", '@prodSanity', '@manageFunds','@web']}, async({page,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        await test.step(`Login by ${user} to ${brand} plarform  and open withdrawal`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
        await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
            await withdrawal.clickMenuPoint(menuPoint)
            await withdrawal.clickPaymentMethod(paymentMethod)
            let amount = await withdrawal.withdrawalCalculation('$')
            let response = await withdrawal.performManualWithdrawal(amount, '**/payment/manual_withdraw')
            expect(await withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
            expect(await withdrawal.getAPIWithdrawalAmount(response)).toBeCloseTo(amount, 0)
            expect(await withdrawal.getNagaMarketsWithdrawalPopupTitle()).toContain(`The withdrawal of $${amount} to your ${menuPoint} is being reviewed.`)

        })
    })}



    type withdrawalTypes = {
        testRailId: string,
        brand: string,
        user: string,
        numberOfEwalletWithdrawal: number
    }
    const testNumberOfWithdrawals: withdrawalTypes[] = [
        {testRailId:'@25354', brand:'@Markets', user:'depositTestMarkets', numberOfEwalletWithdrawal:3},
        {testRailId:'@25355', brand:'@Capital', user:'testTrading2', numberOfEwalletWithdrawal:2},
        {testRailId:'@25398', brand:'@Mena', user:'testTrading@naga.com', numberOfEwalletWithdrawal:1},
        {testRailId:'@25426', brand:'@Africa', user:'testTradingAfrica@naga.com', numberOfEwalletWithdrawal:2}
    ]
    for(const{testRailId, brand, user, numberOfEwalletWithdrawal} of testNumberOfWithdrawals){
        test(`${testRailId} ${brand} Check number of available withdrawals`, 
            {tag:["@withdrawal", '@manageFunds','@web']}, async({page,AppNAGA})=>{
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        await test.step(`Login by ${user} to ${brand} platform`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
            await withdrawal.clickMenuPoint('eWallet')
        })
        await test.step('Check number of available withdrawals}', async()=>{
            expect(await withdrawal.getNumberOfWithdrawalMethods()).toEqual(numberOfEwalletWithdrawal)
        })
        })
    }
})  

    type withdrawalEcompayType = {
        testRailId: string,
        brand: string,
        user: string,
        currency: string,
    }
    const withdrawalEcompayParams: withdrawalEcompayType[] = [
        {testRailId: '@25399', brand: '@Mena', user: 'testTrading@naga.com', currency:'€'},
        {testRailId: '@25427', brand: '@Africa', user: 'testTradingAfrica@naga.com', currency:'$'}
    ]
    
    for(const{testRailId, brand, user, currency}of withdrawalEcompayParams){
        test(`${testRailId} ${brand} Withdrawal. Bank Account. Ecommpay`, 
        {tag:["@withdrawal", '@manageFunds','@prodSanity','@web']},async({page,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        let signIn = new SignIn(page);
        let mainPage = new MainPage(page);
        let withdrawal = new Withdrawal(page);
        await test.step(`Login to ${brand} by ${user} and open withdrawal`, async()=>{
            await signIn.goto(AppNAGA,'login');
            await signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await mainPage.openBackMenuPoint('Manage Funds');
            await new Withdrawal(page).chooseWithdrawalMenu();
        });
        await test.step(`Make Ecommpay withdrawal`, async()=>{
            await withdrawal.clickMenuPoint('Bank Account')
            let money = await withdrawal.withdrawalCalculation(currency)
            let response = await withdrawal.performManualWithdrawal(money, '**/api/cashier/get-gateway-list-without-details')
            expect(await withdrawal.getApiPaymentMethodKey(response)).toEqual('Credit Card')
            expect(await withdrawal.getApiStatusCode(response)).toEqual(200)
        })
    })}
    
 
