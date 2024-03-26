import { SignUp } from '../pageObjects/ShortRegistrationPage/SighUpPage'
import { test} from '../test-options';

test("Short registration Naga Capital", async({page})=>{
    await page.goto("https://sxdevcap.com/register")
    let shortRegPage = new SignUp(page);
    console.log(await page.context().cookies())
})

