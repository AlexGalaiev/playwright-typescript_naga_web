import { expect } from "@playwright/test"
import {test} from "../../test-options"
test.describe('WEB.Instrument page', async()=>{

    let userEmail = 'testTradingCrypro2@naga.com'
    let tradingInstrument = 'Dogecoin (Doge)'

    test.beforeEach('Login to platform', async({app, AppNAGAX}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        await test.step('Login to platform and skip 2Auth verifications', async()=>{
            await app.signIn.goto(AppNAGAX, 'login')
            await app.signIn.signInUserToPlatform(userEmail, process.env.USER_PASSWORD || "")
            await app.signIn.skip2AF()
        })
        await test.step(`Open Crypto wallet menu point. Search and open ${tradingInstrument} instrument`, async()=>{
            await app.cryptoMainPage.openBackMenuPoint('Crypto Wallet')
            await app.cryptoMainPage.searchAndOpenInstrument(tradingInstrument)
        })
    })

    test.skip('@Crypto. Check Buy\sell btn on instrument page', {tag:['@web', '@crypto']}, async({app})=>{
        await test.step('Click buy\sell button', async()=>{
            await app.cryptoMainPage.clickBuySellBtn()
            expect(await app.cryptoMainPage.getSourceInstrumentName()).toEqual('Dogecoin (Doge) ')
            expect(await app.cryptoMainPage.getDestinationInstrumentName()).toEqual('Bitcoin ')
            expect(await app.cryptoMainPage.checkBuySellTittleIsVisible()).toBeTruthy()
        })
    })

    test.skip(`@Crypto. Check Deposit elements on instrument page`, {tag:['@web', '@crypto']}, async({app})=>{
        await test.step('Check deposit qr code, wallet address, copy btn', async()=>{
            expect(await app.cryptoMainPage.checkQRCodeVisible()).toBeTruthy()
            expect(await app.cryptoMainPage.checkWalletVisible()).toBeTruthy()
            expect(await app.cryptoMainPage.checkCopyButtonWorks()).toEqual('Copied')
        })
    })

    test.skip(`@Crypto. Check withdrawal elements on instrument page`, {tag:['@web', '@crypto']}, async({app})=>{
        await test.step('Check withdrawal elements on the page: input field', async()=>{
            await app.cryptoMainPage.switchToWithdrawTab()
            await app.cryptoMainPage.inputWithdrawalAmount('10000')
            expect(await app.cryptoMainPage.getErrorMsgText()).toEqual("You don´t have enough funds in your wallet.")
        })
        await test.step('Check Address book popup', async()=>{
            await app.cryptoMainPage.openAddressBook()
            expect(await app.cryptoMainPage.checkDogeCoinAddressBookPopupVisible()).toBeTruthy()
            expect(await app.cryptoMainPage.checkEmptyPageVisible()).toBeTruthy()
        })})
})

test.describe('All Instruments. WEB', async()=>{

    let userEmail = 'testTradingCrypro2@naga.com'
    let tradingInstrument = 'Dogecoin (Doge)'

    test.beforeEach('Login to platform', async({app, AppNAGAX}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        await test.step('Login to platform and skip 2Auth verifications', async()=>{
            await app.signIn.goto(AppNAGAX, 'login')
            await app.signIn.signInUserToPlatform(userEmail, process.env.USER_PASSWORD || "")
            await app.signIn.skip2AF()
        })
        await test.step(`Open Crypto wallet menu point. Search and open ${tradingInstrument} instrument`, async()=>{
            await app.cryptoMainPage.openBackMenuPoint('Crypto Wallet')
        })
    })

    test.skip('@Crypto. Check Deposit btn on ALL instruments page', {tag:['@web', '@crypto']}, async({app})=>{
        await app.cryptoMainPage.cryptoWalletDepositBtnClick()
        expect(await app.cryptoMainPage.checkDepositScreen()).toBeTruthy()
    })
    test.skip('@Crypto. Check Buy|Sell  btn on ALL instruments page', {tag:['@web', '@crypto']}, async({app})=>{
        await app.cryptoMainPage.cryptoWalleBuySellBtnClick()
        expect(await app.cryptoMainPage.checkBuySellTittleIsVisible()).toBeTruthy()
    })
    test.skip('@Crypto. Check Actions dropdown. Check redirect from Buy|Sell button to buySell widget', {tag:['@web', '@crypto']}, async({app})=>{
        await app.cryptoMainPage.searchInstrument(tradingInstrument)
        await app.cryptoMainPage.openActionDropdownPointMenu('Buy / Sell')
        expect(await app.cryptoMainPage.checkBuySellTittleIsVisible()).toBeTruthy()
    })
    test.skip('@Crypto. Check Actions dropdown. Check redirect from Deposit btn to QR code', {tag:['@web', '@crypto']}, async({app})=>{
        await app.cryptoMainPage.searchInstrument(tradingInstrument)
        await app.cryptoMainPage.openActionDropdownPointMenu('Deposit')
        expect(await app.cryptoMainPage.checkQRCodeVisible()).toBeTruthy()
    })
    test.skip('@Crypto. Check Actions dropdown. Check redirect from Withdraw btn to QR code', {tag:['@web', '@crypto']}, async({app})=>{
        await app.cryptoMainPage.searchInstrument(tradingInstrument)
        await app.cryptoMainPage.openActionDropdownPointMenu('Withdraw')
        expect(await app.cryptoMainPage.checkWalletVisible()).toBeTruthy()
    })

})