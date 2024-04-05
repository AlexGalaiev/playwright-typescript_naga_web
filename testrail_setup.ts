import TestRail from "@dlenroc/testrail";
import TestrailApiClient from "testrail-api";


export class TestRailIntegration{
    readonly TestRail: TestRail;
    readonly TestProject: number;
    CaseId: number | undefined;
    TestRunId: number | undefined;
    
    constructor(){
        this.TestRail = new TestRail({
            host: "https://naga.testrail.io/",
            username: process.env.TESTRAIL_USERNAME || '',
            password: process.env.TESTRAIL_PASSWORD || ''
        }),
        this.CaseId;
        this.TestRunId;
    };

    async AddAutomationRun(){
        const cases = await this.getTestCases(4,3)
        const addRunId = await this.TestRail.addRun(1, {
            suite_id:7,
            name:'Naga Automation',
            description:'Naga Automation test cases for all brands',
            include_all:false,
            case_ids: cases.map(testCase => testCase.id)

        });
        this.TestRunId = addRunId.id;
        return this.TestRunId
    };
    async AddManualRun(){
        const cases = await this.getTestCases(3,13)
        const addRunId = await this.TestRail.addRun(1, {
            suite_id:7,
            name:'Naga Manual',
            description:'Naga manual cases for all brands',
            include_all:false,
            case_ids: cases.map(testCase => testCase.id)

        });
        let TestRunId = addRunId.id;
        return TestRunId
    };

    async getTestCases(priority: number, type: number){
        let cases = await this.TestRail.getCases(1,{
            priority_id:priority,
            type_id: type
        });
        return cases;
    }; 
    async getTestATRun(){
        let testRun = this.TestRail.getRuns(1);
        let filterRuns = (await testRun).filter((tittleRun)=>tittleRun.name.includes('Naga AT'));
        return filterRuns
    };
    
    
    async getTestCaseIdFromRun(RunId:number){
        const username = process.env.TESTRAIL_USERNAME || '';
        const password = process.env.TESTRAIL_PASSWORD || '';
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Basic " + btoa(`${username}:${password}`));
        myHeaders.append("Cookie", "tr_session=a82a5cd8-7ac0-4898-b21f-b0af952411e7");
        const requestOptions = {method: "GET", headers: myHeaders, redirect: "follow"};
        try {
          const response = await fetch(`https://naga.testrail.io/index.php?/api/v2/get_tests/${RunId}`, requestOptions);
          const result = await response.text();
          return result;
        } catch (error) {
          console.error(error);
        }
      };

       
}
