import { expect } from "@playwright/test"
import {test} from "..//..//test-options"
test.describe('WEB', async()=>{

    let userEmail = 'testTradingCrypro2@naga.com'
    let tradingInstrument = 'Dogecoin (Doge)'

    test.beforeEach('Login to platform', async({app, AppNAGAX}, testInfo)=>{
        testInfo.setTimeout(testInfo.timeout + 10000)
        await app.signIn.goto(AppNAGAX, 'login')
        await app.signIn.signInUserToPlatform(userEmail, process.env.USER_PASSWORD || "")
        await app.signIn.skip2AF()
    })

    test('@crypto. Check Buy\sell btn', {tag:['@web', '@crypto']}, async({app})=>{
        await test.step(`Open Crypto wallet menu point. Search and open ${tradingInstrument} instrument`, async()=>{
            await app.cryptoMainPage.openBackMenuPoint('Crypto Wallet')
            await app.cryptoMainPage.searchAndOpenInstrument(tradingInstrument)
        })
        await test.step('Click buy\sell button', async()=>{
            await app.cryptoMainPage.clickBuySellBtn()
            expect(await app.cryptoMainPage.getSourceInstrumentName()).toEqual('Dogecoin (Doge) ')
            expect(await app.cryptoMainPage.getDestinationInstrumentName()).toEqual('Bitcoin ')
            expect(await app.cryptoMainPage.checkBuySellTittleIsVisible()).toBeTruthy()
        })
    })
})