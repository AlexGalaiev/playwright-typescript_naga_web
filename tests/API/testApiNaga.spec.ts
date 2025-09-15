import {test} from "..//..//test-options"
test.describe('Api tests', async()=>{

    test('login user', async({request})=>{

    let loginResponse = await request.post('https://api-v2.naga.com/user/login',
        {
            'data':{"user_name":"testTrading2","password":"xxA36VLk5eX7zWqBZM36Ppq8VUUD61ZR189d+g6fYmo=","device_uuid":"99768926b3358dffb75aeca3b6bfff98","g_recaptcha_type":"geetest","get_user_info":true},
            'headers':{"Platform":"web-trader"}
        })
    })

})