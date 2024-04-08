import {test} from "..//test-options"
import { TestInfo } from "playwright/test";
import { TestRailIntegration } from "../testrail_setup";
import _ from 'lodash'


test("@24926 test", async( {}, testInfo)=>{
    let Tr = new TestRailIntegration();
    // await Tr.getTestCaseId(1236, test.info().tags)
    // await Tr.addResult(1236, test.info().tags)   
    await Tr.addResulToTest(1236, await test.info().tags)


    // let tags = ['@24926']
    // const testRailData = await Tr.getTestCaseIdFromRun(1236);
    // let findId = _.find(testRailData.tests, {case_id: _.toNumber(tags[0]?.replace('@',''))});
    // console.log('findId',findId.id);   
})

