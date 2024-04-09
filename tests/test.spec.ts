import {test} from "../test-options";



test("test @24926", async({page})=>{
    console.log('22222')
    console.log(await test.info().status)
    test.info().status
})

