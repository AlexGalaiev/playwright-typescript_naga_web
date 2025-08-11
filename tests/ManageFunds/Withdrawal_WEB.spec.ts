import { expect } from "@playwright/test";
import {test} from "../../test-options"
import { getLocalization } from "../../pageObjects/localization/getText";

test.describe("Withdrawal Capital", async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    let amountValueToWithrawal = '55'

    test.beforeEach("Login by trade user", async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })
    
    test.fixme("Withdrawal via credit card", 
        {tag:['@withdrawal', '@manageFunds'], 
            annotation:{'description':'Cannot open withdrawal','type':'configuration issue'}}, async({app})=>{
        await test.step('Make withdrawal via credit card', async()=>{
            await app.withdrawal.clickMenuPoint('Credit Card');
            await app.withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            expect(await app.withdrawal.getWithdrawalAmountValue()).toContain(amountValueToWithrawal);
        })
        await test.step("Check withdrawal params", async()=>{
            let responseTitle = await app.withdrawal.checkWithdrawalRequest()
            expect(await app.withdrawal.getTitleOfCashierName()).toContain('Credit Card')
            expect(await app.withdrawal.checkNameOfIframe()).toEqual('_cashier_iframe')
        })
    })
    test("Withdrawal validation rulls", 
        {tag:['@withdrawal', '@manageFunds','@web']},async({app})=>{
        let valueToWithrawal = '1'
        await test.step('Open withdrawal menu', async()=>{
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');
        })
        await test.step('Input NOT valid amount for withdrawal', async()=>{
            await app.withdrawal.clickMenuPoint('Credit Card');
            await app.withdrawal.inputAmountWithdrawal(valueToWithrawal);
            expect(await app.withdrawal.getErrorText()).toContain("Amount has to be greater than or equal to")
        });
        await test.step("Open modal popup for cc cashier", async()=>{
            await app.withdrawal.openModalCCPopup();
            expect(await app.withdrawal.checkModalPopup()).toBeVisible()
        })
    });

    test("Crypto withdrawal", {tag:['@withdrawal', '@manageFunds','@web']},
        async({app})=>{
        let localization = new getLocalization(ManageFunds_Withdrawal);
        await test.step('Open withdrawal menu', async()=>{
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');
        })
        await test.step("Make crypto withdrawal", async()=>{
            await app.withdrawal.clickMenuPoint('Crypto')
            await app.withdrawal.inputAmountWithdrawal(amountValueToWithrawal);
            await app.withdrawal.clickWithdrawBtn();
        })
        await test.step("Check crypto wallet popup", async()=>{
            expect(await app.withdrawal.checkCryptoPopup()).toBeVisible()
            expect(await app.withdrawal.checkCryptoPopupHeaderText()).toEqual('Withdraw to Crypto')
            await app.withdrawal.performCryptoWithdrawalToTestAccount();
        })
        await test.step('Check crypto withdrawal success popup', async()=>{
            expect(await app.withdrawal.checkCryptoWithdrawalSuccessPopup()).toBeTruthy()
            expect(await app.withdrawal.checkCryptoSuccessPopupText()).toEqual(await localization.getLocalizationText("CryptoWithdrawalSuccessPopupText"))
        })
    })
})

test.describe('Withdrawal Markets', async()=>{
    test("PayPal withdrawal", {tag:['@withdrawal', '@manageFunds','@web']},
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 40000)
        let amountValueToWithrawal = 100
        await test.step('Login by depositTestMarkets3 to NagaMarkets and open withdrawal', async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform("depositTestMarkets3", process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');
        });
        await test.step('Open Pay pal withdrawal', async()=>{
            await app.withdrawal.clickMenuPoint('PayPal')
            let response = await app.withdrawal.performManualWithdrawal(amountValueToWithrawal, '**/payment/paypal/withdraw')
            expect(await app.withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
        })})
})

test.describe('Withdrawal. All brands', async()=>{

type NS_WithdrawalTypes = {
    brand: string,
    user: string,
    menuPoint: string,
    paymentMethod: string,
    responsePaymentMethod: string
}
const NS_WithdrawalParams: NS_WithdrawalTypes[] = [
    { brand: '@Capital', user: 'testWithdrawal@i.ua', menuPoint: 'eWallet', paymentMethod: 'neteller', responsePaymentMethod:'altneteller'},
    { brand: '@Capital', user: 'testWithdrawal2@i.ua', menuPoint: 'eWallet', paymentMethod: 'skrill', responsePaymentMethod:'skrill'},
]
//difference between NagaMarkets and NagaCapital -> Markets has withdrawal popup, Capital opens iframe
for(const{ brand, user, menuPoint, paymentMethod, responsePaymentMethod}of NS_WithdrawalParams){
    test(` ${brand} EWallet withdrawals. Check ${paymentMethod} withdrawal`, 
        {tag: ["@withdrawal", '@prodSanity', '@manageFunds','@web']}, 
        async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 70000)
        await test.step(`Login by ${user} to ${brand} platform and open withdrawal`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');

        });
        await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
            await app.withdrawal.clickMenuPoint(menuPoint)
            await app.withdrawal.clickPaymentMethod(paymentMethod)
            let amount = await app.withdrawal.withdrawalCalculation('$', 10)
            let response = await app.withdrawal.performManualWithdrawal(amount, '**/api/cashier/get-gateway-list-without-details')
            expect(await app.withdrawal.getApiPaymentMethodKey(response)).toEqual(responsePaymentMethod)
            expect(await app.withdrawal.getApiStatusCode(response)).toEqual(200)
        })
    })
}

//difference between NagaMarkets and NagaCapital -> Markets has withdrawal popup, Capital opens iframe
type NM_WithdrawalTypes = {
    brand: string,
    user: string,
    menuPoint: string,
    paymentMethod: string,
    withdrawalPageTitle: string
}
const NM_WithdrawalParams: NM_WithdrawalTypes[] = [
    {brand: '@Markets', user: 'depositTestMarkets', menuPoint: 'eWallet', paymentMethod: 'sofort', withdrawalPageTitle: 'Neteller'},
    {brand: '@Markets', user: 'depositTestMarkets1', menuPoint: 'eWallet', paymentMethod: 'giropay', withdrawalPageTitle: 'Skrill'},
    {brand: '@Markets', user: 'depositTestMarkets2', menuPoint: 'eWallet', paymentMethod: 'webmoney', withdrawalPageTitle: 'Perfect Money'}
]
for(const{ brand, user, menuPoint, paymentMethod,withdrawalPageTitle} of NM_WithdrawalParams){
    test(` ${brand} Ewallet withdrawal. Check ${withdrawalPageTitle} withdrawal`, 
        {tag: ["@withdrawal", '@prodSanity', '@manageFunds','@web']}, 
        async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000)
        let amount;
        let responseAmount;
        let response
        await test.step(`Login by ${user} to ${brand} plarform  and open withdrawal`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');
        });
        await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
            await app.withdrawal.clickMenuPoint(menuPoint)
            await app.withdrawal.clickPaymentMethod(paymentMethod)
            amount = await app.withdrawal.withdrawalCalculation('$',10)
            response = await app.withdrawal.performManualWithdrawal(amount, '**/payment/manual_withdraw')
            responseAmount = await app.withdrawal.getAPIWithdrawalAmount(response)
        })
        await test.step(`withdrawal values: UI-${amount}, responseAmount -${responseAmount}`, async()=>{
            expect(await app.withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
            expect(await app.withdrawal.getAPIWithdrawalAmount(response)).toBeCloseTo(amount, 0)
            expect(await app.withdrawal.getWithdrawalPopupTittle()).toEqual('Withdrawal request received!')
        })
    })}

    type withdrawalTypes = {
        brand: string,
        user: string,
        numberOfEwalletWithdrawal: number
    }
    const testNumberOfWithdrawals: withdrawalTypes[] = [
        {brand:'@Markets', user:'depositTestMarkets', numberOfEwalletWithdrawal:3},
        {brand:'@Capital', user:'testTrading2', numberOfEwalletWithdrawal:2},
        {brand:'@Mena', user:'testTrading@naga.com', numberOfEwalletWithdrawal:1},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com', numberOfEwalletWithdrawal:2}
        //{brand:'@Africa', user:'testTradingAfrica@naga.com', numberOfEwalletWithdrawal:2}
    ]
    for(const{ brand, user, numberOfEwalletWithdrawal} of testNumberOfWithdrawals){
        test(`${brand} Check number of available withdrawals`, 
            {tag:["@withdrawal", '@manageFunds','@web']}, 
            async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 60000);
        await test.step(`Login by ${user} to ${brand} platform`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');
            await app.withdrawal.clickMenuPoint('eWallet')
        })
        await test.step('Check number of available withdrawals}', async()=>{
            expect(await app.withdrawal.getNumberOfWithdrawalMethods()).toEqual(numberOfEwalletWithdrawal)
        })
        })
    }
})  

    type withdrawalEcompayType = {
        brand: string,
        user: string,
        currency: string,
    }
    const withdrawalEcompayParams: withdrawalEcompayType[] = [
        { brand: '@Mena', user: 'testTrading@naga.com', currency:'€'},
        { brand: '@Africa', user: 'testTradingAfrica2@naga.com', currency:'$'}
    ]
    
    for(const{ brand, user, currency}of withdrawalEcompayParams){
        test(` ${brand} Withdrawal. Bank Account. Ecommpay`, 
        {tag:["@withdrawal", '@manageFunds','@prodSanity','@web']},
        async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000)
        await test.step(`Login to ${brand} by ${user} and open withdrawal`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openBackMenuSubcategory('Manage Funds', 'Withdraw');

        });
        await test.step(`Make Ecommpay withdrawal`, async()=>{
            await app.withdrawal.clickMenuPoint('Bank Account')
            let money = await app.withdrawal.withdrawalCalculation(currency, 10)
            let response = await app.withdrawal.performManualWithdrawal(money, '**/api/cashier/get-gateway-list-without-details')
            expect(await app.withdrawal.getApiPaymentMethodKey(response)).toEqual('Credit Card')
            expect(await app.withdrawal.getApiStatusCode(response)).toEqual(200)
        })
    })}