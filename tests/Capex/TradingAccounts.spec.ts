import { expect } from "@playwright/test"
import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import {test} from "..//..//test-options"

test.skip(`Create trading account for fully registered user`, {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
    let email = new RandomUser().getRandomUserEmail()
    testInfo.setTimeout(testInfo.timeout+180000)
    await test.step(`Create lead user with ${email} email`, async()=>{
        await app.shortRegistrationCapex.open(Capex, 'register')
        await app.shortRegistrationCapex.createLeadUser(email)
    })
    await test.step('Finish full registration for user', async()=>{
        await app.mainPageCapex.openCategoryMenu('My Portal')
        await app.capexKYC.createFullyRegisteredUser()
    })
    await test.step('Create trading account', async()=>{
        await app.mainPageCapex.openCategoryMenu('My Portal') 
        await app.mainPageCapex.openCategoryMenu('Trading Accounts')
    })
})

type CapexTypes = {
    platform: string,
    account: string, 
    type: string,
    currency: string
}
const CapexParams: CapexTypes[] = [
    {platform:'CPX',account:'305549656',type:'Real', currency:'USD'},
    {platform:'CPX',account:'513093354',type:'Real', currency:'USD'},
    {platform:'CPX',account:'2103850678',type:'Demo', currency:'USD'},
    {platform:'MT5',account:'4001229',type:'Real', currency:'USD'},
    {platform:'MT5',account:'2004507',type:'Demo', currency:'USD'}
]
for(const{platform, account, type, currency} of CapexParams){
    test(`Check visibility of ${platform} ${account} account, ${type} type in trading profile`, 
        {tag:['@web', '@Capex']}, async({app, Capex})=>{
    let user = "capexFullReg@capex.com"
    await test.step(`Open platform and login. User - ${user}`, async()=>{
        await app.signInCapex.open(Capex, 'login')
        await app.signInCapex.loginToPlatform(user,  process.env.USER_PASSWORD || '')
    })
    await test.step('Open My portal and check visibility on main page', async()=>{
        await app.mainPageCapex.openCategoryMenu('My Portal')
        await app.mainPageCapex.waitForAccountTable()
        expect(await app.mainPageCapex.checkAccountPlatformVisibility(account, platform)).toBeTruthy()
        expect(await app.mainPageCapex.checkAccountPlatformAccountIdVisibility(account)).toBeTruthy()
        expect(await app.mainPageCapex.checkAccountPlatformType(account, type)).toBeTruthy()
        expect(await app.mainPageCapex.checkAccountPlatformCurrency(account, currency)).toBeTruthy()
    })})
}

for(const{platform, account, type, currency} of CapexParams){
    test(`Check visibility ${account} in Capex Trader ${platform}`, {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
    testInfo.setTimeout(testInfo.timeout+15000)    
    let user = "capexFullReg@capex.com"
    await test.step(`Open platform and login. User - ${user}`, async()=>{
        await app.signInCapex.open(Capex, 'login')
        await app.signInCapex.loginToPlatform(user,  process.env.USER_PASSWORD || '')
    })
    await test.step('Open Capex Trader menu point. And check information on page', async()=>{
        await app.mainPageCapex.openCategoryMenu('CAPEX Trader')
        await app.mainPageCapex.openCapexTradeDetailsInfo()
        expect(await app.mainPageCapex.checkAccountPlatformVisibility(account, platform)).toBeTruthy()
        expect(await app.mainPageCapex.checkAccountPlatformAccountIdVisibility(account)).toBeTruthy()
        expect(await app.mainPageCapex.checkAccountPlatformType(account, type)).toBeTruthy()
        expect(await app.mainPageCapex.checkAccountPlatformCurrency(account, currency)).toBeTruthy()
    })})
}

test('Filtering accounts per Platform and Type', {tag:['@web', '@Capex']}, async({app, Capex}, testInfo)=>{
    let user = "capexFullReg@capex.com"
    testInfo.setTimeout(testInfo.timeout+10000)
    await test.step(`Open platform and login. User - ${user}`, async()=>{
        await app.signInCapex.open(Capex, 'login')
        await app.signInCapex.loginToPlatform(user,  process.env.USER_PASSWORD || '')
    })
    await test.step('Open accounts and filter per platform type', async()=>{
        await app.mainPageCapex.openCategoryMenu('CAPEX Trader')
        await app.mainPageCapex.openCapexTradeDetailsInfo()
        await app.mainPageCapex.openFilters()
        await app.mainPageCapex.filterViaOption('CPX', 'Platform')
        expect(await app.mainPageCapex.checkPlatformTypeDisplay('MT5')).not.toBeVisible()
    })
    await test.step('Open accounts and filter per type', async()=>{
        await app.mainPageCapex.filterViaOption('Real', 'Real/Demo')
        expect(await app.mainPageCapex.checkPlatformTypeDisplay('Demo')).not.toBeVisible()
    })
})