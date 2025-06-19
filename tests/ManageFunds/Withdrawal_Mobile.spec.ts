import { expect } from "@playwright/test";
import { test } from "../../test-options";
import { getLocalization } from "../../pageObjects/localization/getText";


test.describe('Withdrawal Mobile NS', async()=>{
    const ManageFunds_Withdrawal = "/pageObjects/localization/ManageFunds_Withdrawal.json";
    let amountValueToWithrawal = '55'

    test.beforeEach("Login by trade user", async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000);
        //let signIn = new SignIn(page);
        await test.step('Login by withdrawal user to platform and open withdrawal', async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform("testTrading2", process.env.USER_PASSWORD || '');
        });
    })
    test("Mobile Withdrawal validation rulls", 
        {tag:['@withdrawal', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({app})=>{
        let valueToWithrawal = '1'
        await test.step('Open withdrawal menu', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Withdraw')
            await app.deposit.checkActiveMobileManageTab('withdraw')
        })
        await test.step('Input NOT valid amount for withdrawal', async()=>{
            await app.withdrawal.chooseMobileWithdrawalMethod('Credit Card');
            await app.withdrawal.inputAmountWithdrawal(valueToWithrawal);
            expect(await app.withdrawal.getErrorText()).toContain("Amount has to be greater than or equal to")
        });
        await test.step("Open modal popup for cc cashier", async()=>{
            await app.withdrawal.openModalCCPopup();
            expect(await app.withdrawal.checkModalPopup()).toBeVisible()
        })
    })
    test("Mobile. Crypto withdrawal", 
        {tag:['@withdrawal', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({app})=>{
        let localization = new getLocalization(ManageFunds_Withdrawal)
        await test.step('Open withdrawal menu', async()=>{
            await app.mainPage.openMobileBackMenuPoint('Withdraw')
            await app.deposit.checkActiveMobileManageTab('withdraw')
        })
        await test.step("Make crypto withdrawal", async()=>{
            await app.withdrawal.chooseMobileWithdrawalMethod('Crypto');
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

test.describe('Withdrawal Mobile NM', async()=>{
    test("Mobile PayPal withdrawal", 
        {tag:['@withdrawal', '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({app, AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 20000)
        let amountValueToWithrawal = 100
        await test.step('Login by depositTestMarkets3 to NagaMarkets and open withdrawal', async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform("depositTestMarkets3", process.env.USER_PASSWORD || '');
            await app.mainPage.openMobileBackMenuPoint('Withdraw')
            await app.deposit.checkActiveMobileManageTab('withdraw')
        });
        await test.step('Open Pay pal withdrawal', async()=>{
            await app.withdrawal.chooseMobileWithdrawalMethod('PayPal')
            let response = await app.withdrawal.performManualWithdrawal(amountValueToWithrawal, '**/payment/paypal/withdraw')
            expect(await app.withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
            expect(await app.withdrawal.getAPIWithdrawalAmount(response)).toEqual(amountValueToWithrawal)
        })
    })
})

test.describe('Withdrawal Mobile All brands', async()=>{

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

    for(const{brand, user, menuPoint, paymentMethod, responsePaymentMethod}of NS_WithdrawalParams){
        test(`Mobile ${brand} EWallet withdrawals. Check ${paymentMethod} withdrawal`, 
            {tag: ["@withdrawal", '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
            async({app,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 50000);
            await test.step(`Login by ${user} to ${brand} platform and open ${paymentMethod} withdrawal`, async()=>{
                await app.signIn.goto(AppNAGA,'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await app.mainPage.openMobileBackMenuPoint('Withdraw')
                await app.deposit.checkActiveMobileManageTab('withdraw')
                await app.withdrawal.chooseMobileWithdrawalMethod(menuPoint);
                await app.withdrawal.chooseMobileEWalletMethod(paymentMethod)
            });
            await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
                let amount = await app.withdrawal.withdrawalCalculation('$', 10)
                let response = await app.withdrawal.performManualWithdrawal(amount, '**/api/cashier/get-gateway-list-without-details')
                expect(await app.withdrawal.getApiPaymentMethodKey(response)).toEqual(responsePaymentMethod)
                expect(await app.withdrawal.getApiStatusCode(response)).toEqual(200)
            })
        })
    }
    type NM_WithdrawalTypes = {
        brand: string,
        user: string,
        menuPoint: string,
        paymentMethod: string,
        withdrawalPageTitle: string
    }
    const NM_WithdrawalParams: NM_WithdrawalTypes[] = [
        { brand: '@Markets', user: 'depositTestMarkets', menuPoint: 'eWallet', paymentMethod: 'sofort', withdrawalPageTitle: 'Neteller'},
        { brand: '@Markets', user: 'depositTestMarkets1', menuPoint: 'eWallet', paymentMethod: 'giropay', withdrawalPageTitle: 'Skrill'},
        { brand: '@Markets', user: 'depositTestMarkets2', menuPoint: 'eWallet', paymentMethod: 'webmoney', withdrawalPageTitle: 'Perfect Money'}
    ]

    for(const{brand, user, menuPoint, paymentMethod,withdrawalPageTitle} of NM_WithdrawalParams){
        test(` Mobile ${brand} Ewallet withdrawal. Check ${withdrawalPageTitle} withdrawal`, 
            {tag: ["@withdrawal", '@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}}, 
            async({app,AppNAGA}, testInfo)=>{
            testInfo.setTimeout(testInfo.timeout + 20000)
            await test.step(`Login by ${user} to ${brand} plarform  and open withdrawal`, async()=>{
                await app.signIn.goto(AppNAGA,'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
                await app.mainPage.openMobileBackMenuPoint('Withdraw')
                await app.deposit.checkActiveMobileManageTab('withdraw');
            });
            await test.step(`Make ${paymentMethod} withdrawal`, async()=>{
                await app.withdrawal.chooseMobileWithdrawalMethod(menuPoint);
                await app.withdrawal.chooseMobileEWalletMethod(paymentMethod)
                let amount = await app.withdrawal.withdrawalCalculation('$', 10)
                let response = await app.withdrawal.performManualWithdrawal(amount, '**/payment/manual_withdraw')
                expect(await app.withdrawal.getAPIWithdrawalMSG(response)).toEqual('Command has been processed successfully.')
                expect(await app.withdrawal.getAPIWithdrawalAmount(response)).toEqual(amount)
                expect(await app.withdrawal.getNagaMarketsWithdrawalPopupTitle()).toContain(`The withdrawal of $${amount} to your ${menuPoint} is being reviewed.`)
    
            })
        })}
    type withdrawalEcompayType = {
        brand: string,
        user: string,
        currency: string,
    }
    const withdrawalEcompayParams: withdrawalEcompayType[] = [
        { brand: '@Mena', user: 'testTrading@naga.com', currency:'€'},
        { brand: '@Africa', user: 'testTradingAfrica@naga.com', currency:'$'}
    ]
    for(const{ brand, user, currency}of withdrawalEcompayParams){
        test(` Mobile ${brand} Withdrawal. Bank Account. Ecommpay`, 
        {tag:["@withdrawal",'@mobile', '@manageFunds'], annotation:{description:'https://keywaygroup.atlassian.net/browse/RG-9088', 'type':'ticket'}},
        async({app,AppNAGA}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 50000)
        await test.step(`Login to ${brand} by ${user} and open withdrawal`, async()=>{
            await app.signIn.goto(AppNAGA,'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '');
            await app.mainPage.openMobileBackMenuPoint('Withdraw')
            await app.deposit.checkActiveMobileManageTab('withdraw');
        });
        await test.step(`Make Ecommpay withdrawal`, async()=>{
            await app.withdrawal.chooseMobileWithdrawalMethod('Bank Account');
            let money = await app.withdrawal.withdrawalCalculation(currency, 10)
            let response = await app.withdrawal.performManualWithdrawal(money, '**/api/cashier/get-gateway-list-without-details')
            expect(await app.withdrawal.getApiPaymentMethodKey(response)).toEqual('Credit Card')
            expect(await app.withdrawal.getApiStatusCode(response)).toEqual(200)
        })
    })
    }
})
 