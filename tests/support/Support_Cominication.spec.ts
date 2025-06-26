import { expect } from "@playwright/test";
import {test} from "../../test-options"

test.describe('WEB', async()=>{

    type supportPhoneTypes = {
        brand: string,
        user: string,
        phones: Map<string, string>
    }

    const supportPhonesParams: supportPhoneTypes[] = [
        {brand:'@Capital', user:'testSupport@i.ua', phones: new Map<string, string>([['Seychelles', '+248 4 671 946'],['Mexico (México)','+52 556 934 9635'],['Costa Rica', '+506 410 23893'],['Panama (Panamá)', '+507 833 6986']])},
        {brand:'@Markets', user:'testSupportMarkets@i.ua', phones: new Map<string, string>([['France', '+33 9 71 07 44 70'],['Czech Republic (Česká republika)','+420 354 978 902'],['Hungary (Magyarország)','+36 12 197 027'],['Germany (Deutschland)','+49 30 726111911'],['Italy (Italia)','+39 06 9450 1557'],['Netherlands (Nederland)','+31 20 323 3017'],['Poland (Polska)','+48 57 350 24 89'],['Portugal','+351 300 096 533'],['Romania (România)','+40 31 229 7009'],['Slovakia (Slovensko)','+421 2330 706 14'],['Spain (España)','+34 910 03 17 92'],['Sweden (Sverige)','+46 8 502 802 80'],['Cyprus (Κύπρος)','+357 25 041410'],['Denmark (Danmark)','+45 78 79 39 93'],['Finland (Suomi)','+358 94 2552434'],['Greece (Ελλάδα)','+30 21 5777 9796'],['Latvia (Latvija)','+371 66 163 718'],['Switzerland (Schweiz)','+41 4 45 08 32 44']])},
        {brand:'@Mena', user:'testTradingMena', phones: new Map<string, string>([['United Arab Emirates', '+971 44 98 57 11']])},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com', phones: new Map<string, string>([['South Africa', '+27 100 065 481']])}
    ]

    for(const {brand, user, phones} of supportPhonesParams){
        test(`${brand} Support. Call us phones per country`,
            {tag:['@support','@web']}, async({app, AppNAGA})=>{
        await test.step(`Login to platform by ${user}. Open Help sections`, async()=>{
            await app.signIn.goto(AppNAGA, 'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            await app.mainPage.openBackMenuSubcategory('Help', 'Contact Information')
        })
        await test.step('Check different phone numbers per country', async()=>{
            await app.helpPage.openCallUsPage()
            for(const[countryName, phoneNumber] of phones){
                await app.helpPage.openDropdown()
                await app.helpPage.chooseCountry(countryName)
                expect(await app.helpPage.getPhoneValue()).toEqual(phoneNumber)
            }})
    })}

    type supportLinks ={
        brand: string,
        user: string
    }

    const supportLinksParams: supportLinks[] = [
        {brand:'@Capital', user:'testSupport@i.ua'},
        {brand:'@Markets', user:'testSupportMarkets@i.ua'},
        {brand:'@Mena', user:'testTradingMena'},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com'}
    ]

    for(const {brand, user} of supportLinksParams){
        test(`${brand} Support links - support chat`, {tag:['@support', '@web']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform-${brand} by user - ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
                await app.mainPage.openBackMenuSubcategory('Help', 'Contact Information')
            })
            await test.step('Check visibility of chat', async()=>{
                await app.helpPage.openChat()
                expect(await app.helpPage.checkOpenedChat()).toBeTruthy()
            })})
    }
})

test.describe('Mobile', async()=>{

   type supportPhoneTypes = {
        brand: string,
        user: string,
        phones: Map<string, string>
    }

    const supportPhonesParams: supportPhoneTypes[] = [
        {brand:'@Capital', user:'testSupport@i.ua', phones: new Map<string, string>([['Seychelles', '+248 4 671 946'],['Mexico (México)','+52 556 934 9635'],['Costa Rica', '+506 410 23893'],['Panama (Panamá)', '+507 833 6986']])},
        {brand:'@Markets', user:'testSupportMarkets@i.ua', phones: new Map<string, string>([['France', '+33 9 71 07 44 70'],['Czech Republic (Česká republika)','+420 354 978 902'],['Hungary (Magyarország)','+36 12 197 027'],['Germany (Deutschland)','+49 30 726111911'],['Italy (Italia)','+39 06 9450 1557'],['Netherlands (Nederland)','+31 20 323 3017'],['Poland (Polska)','+48 57 350 24 89'],['Portugal','+351 300 096 533'],['Romania (România)','+40 31 229 7009'],['Slovakia (Slovensko)','+421 2330 706 14'],['Spain (España)','+34 910 03 17 92'],['Sweden (Sverige)','+46 8 502 802 80'],['Cyprus (Κύπρος)','+357 25 041410'],['Denmark (Danmark)','+45 78 79 39 93'],['Finland (Suomi)','+358 94 2552434'],['Greece (Ελλάδα)','+30 21 5777 9796'],['Latvia (Latvija)','+371 66 163 718'],['Switzerland (Schweiz)','+41 4 45 08 32 44']])},
        {brand:'@Mena', user:'testTradingMena', phones: new Map<string, string>([['United Arab Emirates', '+971 22 45 51 00']])},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com', phones: new Map<string, string>([['South Africa', '+27 100 065 481']])}
    ]

    for(const {brand, user, phones} of supportPhonesParams){
        test(`${brand} Mobile support. Call us phones per country`,
            {tag:['@support','@mobile']}, async({app, AppNAGA})=>{
        await test.step(`Login to platform by ${user}. Open Help sections`, async()=>{
            await app.signIn.goto(AppNAGA, 'login');
            await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
            await app.mainPage.openMobileBackMenuPoint('Contact Information')
        })
        await test.step('Check different phone numbers per country', async()=>{
            for(const[countryName, phoneNumber] of phones){
                await app.helpPage.openDropdown()
                await app.helpPage.chooseCountry(countryName)
                expect(await app.helpPage.getPhoneValue()).toEqual(phoneNumber)
            }})
    })}

    type supportLinks ={
        brand: string,
        user: string
    }

    const supportLinksParams: supportLinks[] = [
        {brand:'@Capital', user:'testSupport@i.ua'},
        {brand:'@Markets', user:'testSupportMarkets@i.ua'},
        {brand:'@Mena', user:'testTradingMena'},
        {brand:'@Africa', user:'testTradingAfrica2@naga.com'}
    ]

    for(const {brand, user} of supportLinksParams){
        test(`${brand} Support links - support chat`, {tag:['@support', '@mobile']}, async({app, AppNAGA})=>{
            await test.step(`Login to platform-${brand} by user - ${user}`, async()=>{
                await app.signIn.goto(AppNAGA, 'login');
                await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
                await app.mainPage.openMobileBackMenuPoint('Support Chat')
            })
            await test.step('Check visibility of chat', async()=>{
                expect(await app.helpPage.checkOpenedChat()).toBeTruthy()
            })})
    }
})