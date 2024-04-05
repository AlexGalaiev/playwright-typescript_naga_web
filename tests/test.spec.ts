import {test} from "..//test-options"
import { TestRailIntegration } from "../testrail_setup"


test("@24926, @24343 test", async({})=>{
    let Tr = new TestRailIntegration();
    // let runId = await Tr.AddAutomationRun()
    // let mapIDCases = await Tr.getTestCaseIdFromRun(runId);
    // console.log(typeof(mapIDCases))
    console.log(await test.info().tags)
}    )
