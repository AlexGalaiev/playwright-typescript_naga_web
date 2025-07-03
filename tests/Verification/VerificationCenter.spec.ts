import { expect } from "playwright/test";
import { test } from "../../test-options";

test.describe("Verification center", async() => {
  
  type VerificationTypes = {
    user: string,
    brand: string
  }

  const testVerificatrionParams: VerificationTypes[] = [
    { user: 'testVerification@i.ua', brand: '@Capital'},
    { user: 'testVerificationMarkets@i.ua', brand: '@Markets'},
    { user: 'testVerificationMena@naga.com', brand: '@Mena'},
    { user: 'testVerificationAfrica@naga.com', brand: '@Africa'}
  ]

  for(const{ user, brand }of testVerificatrionParams){
    test(`${brand} Check My documents(My accounts) page`, 
      {tag:["@verification","@web"], annotation:{description:"https://keywaygroup.atlassian.net/browse/RG-9752", type:'ticket'}},async({app, AppNAGA})=>{
      await test.step(`Login by ${user} user, to ${brand}`, async()=>{
        await app.signIn.goto(AppNAGA, "login")
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
      })
      await test.step('Check statuses of uploaded documents in My Accounts', async()=>{
        await app.myAccounts.openUserMenu()
        await app.myAccounts.openMyAccountMenuItem('My Documents')
        expect(await app.verificationPopup.getStatusOdDocuments()).toEqual('Requested')
      })})
    }

  const tesNagaProgressParams: VerificationTypes[] = [
    { user: 'testVerification@i.ua', brand: '@Capital'},
    { user: 'testVerificationAfrica@naga.com', brand: '@Africa'}
  ]
  for(const{ user, brand }of tesNagaProgressParams){
    test(`${brand} Check possibility to open verification center via widget step - Naga progress`, 
      {tag:["@verification","@web"]}, async({app, AppNAGA})=>{
      await test.step(`Login by ${user} user, to ${brand}`, async()=>{
        await app.signIn.goto(AppNAGA, "login")
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
      })
      await test.step('Check response of external verification service', async()=>{
        await app.mainPage.clickOnWidgepPoint('NAGA Progress')
        let response = await app.verificationPopup.getResponseOfExternalService()
        expect(await app.verificationPopup.getStatusCode(response)).toEqual(200)
      })
    })}

    const testNagaVerifyIdentity: VerificationTypes[] = [
      { user: 'testVerificationMarkets@i.ua', brand: '@Markets'},
      { user: 'testVerificationMena@naga.com', brand: '@Mena'}
    ]
    for(const{ user, brand }of testNagaVerifyIdentity){
    test(`${brand} Check possibility to open verification center via widget - Verify Identity`, 
      {tag:["@verification","@web"]}, async({app, AppNAGA})=>{
      await test.step(`Login by ${user} user, to ${brand}`, async()=>{
        await app.signIn.goto(AppNAGA, "login")
        await app.signIn.signInUserToPlatform(user, process.env.USER_PASSWORD || '')
      })
      await test.step('Check response of external verification service', async()=>{
        let response = await app.mainPage.getResponseAfterOpenWidgetPoint('Verify Identity')
        expect(await app.verificationPopup.getStatusCode(response)).toEqual(200)
      })
    })}
})
