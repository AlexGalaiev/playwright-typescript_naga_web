import { en } from "@faker-js/faker";
import { Page  } from "@playwright/test"

export class Captcha{
    private page: Page;


    constructor(page: Page){
        this.page = page;
    }

    async chooseEnv(){
        let envVariable = process.env.ENV
        let env = ''
        if(envVariable === 'production'){
            env = process.env.PRODUCTION_CAPTCHA_BYPASS_TOKEN || ''
            return env
        }
        else if(envVariable === 'qa'){
            env = process.env.DEVELOPMENT_CAPTCHA_BYPASS_TOKEN || ''
            return env
        }
        else if(envVariable === 'canaryQA'){
            env = process.env.DEVELOPMENT_CANARY_CAPTCHA_BYPASS_TOKEN || ''
            return env
        }
        else if(envVariable === 'canaryProd'){
            env = process.env.PRODUCTION_CANARY_CAPTCHA_BYPASS_TOKEN ||''
            return env
        }else{
            env = process.env.PRODUCTION_CAPTCHA_BYPASS_TOKEN || ''
            return env
        }
    }

    async removeCaptcha(){
        let env = await this.chooseEnv()
        let host = await new URL(await this.page.url()).hostname
        let contextPage = await this.page.context()
        await contextPage.addCookies([{
            name:'bypass-captcha', value: env, domain: host, path:'/'
        }])
        if(env === process.env.DEVELOPMENT_CANARY_CAPTCHA_BYPASS_TOKEN || env === process.env.PRODUCTION_CANARY_CAPTCHA_BYPASS_TOKEN){
            await contextPage.addCookies([{
                name:'X-Variant', value:'canary', domain: host, path:'/'
            }])
        }
        await this.page.reload()
        await this.page.waitForTimeout(2000)
    }
}