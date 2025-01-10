import { RandomUser } from "../../pageObjects/common/testUserCredentials/randomUser"
import { YouAreInNagaMarkets } from "../../pageObjects/FullRegistration/components/NAGAMarkets_YouAreInpopup"
import { PersonalInformation } from "../../pageObjects/FullRegistration/NAGACapital-PersonalInformationPage"
import { PhoneVerification } from "../../pageObjects/FullRegistration/NAGACapital-PhoneVerification"
import { SignUp } from "../../pageObjects/ShortRegistrationPage/SighUpPage"
import {test} from "../../test-options"

test.describe('Naga Africa', async()=>{

    test.beforeEach('Create lead user', async({page, NagaAfrica, NagaAfricaCountry})=>{
        let signUp = new SignUp(page)
        let personalInformation = new PersonalInformation(page)
        let email = await new RandomUser().getRandomUserEmail()
        await test.step(`Create lead user with ${email}`, async()=>{
            await signUp.goto(NagaAfrica, 'register')
            await signUp.createCfdUser_All(email, process.env.USER_PASSWORD || '', NagaAfricaCountry)
        })
        await test.step(`Fill personal information`, async()=>{
            await personalInformation.fillPersonalInformation('Verify with SMS')
            await new PhoneVerification(page).insertVerificationCode()
            await new YouAreInNagaMarkets(page).openNagaKyc()
        })
    })

    test('@25366 KYC - Advance score', async({page})=>{
        
        console.log(2)
    })
})