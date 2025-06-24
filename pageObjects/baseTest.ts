import { SignUp } from "./ShortRegistrationPage/SighUpPage";
import { SignIn } from "./SignIn/SignInPage";
import { MainPage } from "./MainPage/MainPage";
import { MyAccounts } from "./MainPage/MyAccounts";
import { Feed } from "./Feed/Feed";
import { UserProfile } from "./UserProfile/UserProfile";
import { Page } from "@playwright/test";
import { KYC_General } from "./FullRegistration/NagaBrands_KycRegistrations";
import { AddAcountForm } from "./UserProfile/AddTradingAccount";
import { AutoCopy } from "./AutoCopy/autocopy";
import { MyTrades } from "./Trading/MyTrades";
import { AllInstruments } from "./Trading/InstrumentsPage";
import { NewPosition } from "./Trading/OpenNewPositionPage";
import { PageAfterLogout } from "./common/logOutPopup/PageAfterLogout";
import { ForgotPassword } from "./SignIn/ForgotPassword";
import { YouAreInNagaMarkets } from "./FullRegistration/components/NAGAMarkets_YouAreInpopup";
import { PersonalInformation } from "./FullRegistration/NAGACapital-PersonalInformationPage";
import { GusetLogin } from "./MainPage/GuestLogin";
import { NagaCom } from "./Website/NagaCom";
import { Leaderboard } from "./MainPage/Leaderboard";
import { NagaEarn } from "./MainPage/NagaEarn";
import { Deposit } from "./ManageFunds/Deposit";
import { InternalTransfer } from "./ManageFunds/InternalTransfer";
import { Withdrawal } from "./ManageFunds/Withdrawal";
import { TradeDetails } from "./Trading/TradeDetails";
import { ChangeLimitsPopup } from "./Trading/ChangeLimitsPopup";
import { ChangeLimitSuccessPopup } from "./Trading/ChangeLimitResultPopup";
import { ClosePositionSuccessPopup } from "./Trading/closePositionSuccessPopup";
import { RealStockPopup } from "./Trading/realStockShortPosition";
import { PriceAlert } from "./Trading/PriceAlertsPage";
import { HelpPage } from "./Support/HelpPage";
import { SettingsPage } from "./Settings/SettingsPage";
import { VerificationPopup } from "./VerificationCenter/verificationPopup";
import { PhoneVerification } from "./FullRegistration/NAGACapital-PhoneVerification";
import { KYC_Start } from "./FullRegistration/NAGAMarkets-KYCStart";
import { FullRegistration } from "./FullRegistration/NagaMarkets_FullRegistration";
import { FinalStep } from "./FullRegistration/NAGAMarkets_KYCFinalStep";
import { MenaFullRegistration } from "./FullRegistration/NagaMena_FullRegistration";
import { KYC_Africa } from "./FullRegistration/NagaAfrica_FullRegistrations";
import { StartKYCPopup } from "./common/startKYC_Popup/startKYCPage";
import { UdpateAccount } from "./FullRegistration/NAGACapital-UpdateAccount";

export class BaseTest{
    page: Page
    signIn: SignIn;
    signUp: SignUp;
    mainPage: MainPage;
    myAccounts: MyAccounts;
    feed: Feed;
    userProfile: UserProfile;
    KYC_Registration: KYC_General;
    addAccount: AddAcountForm;
    autoCopy: AutoCopy;
    myTrades: MyTrades;
    instruments: AllInstruments;
    newPosition: NewPosition;
    pageAfterLogin: PageAfterLogout;
    forgotPassword: ForgotPassword;
    youAreIn: YouAreInNagaMarkets;
    personalInformation: PersonalInformation;
    guestLogin: GusetLogin
    website: NagaCom
    leaderboard: Leaderboard
    nagaEarn: NagaEarn
    deposit: Deposit
    internalTransfer: InternalTransfer
    withdrawal: Withdrawal
    tradeDetails: TradeDetails
    changeLimitPopup: ChangeLimitsPopup
    changeLimitSuccessPopup: ChangeLimitSuccessPopup
    successfullClosePopup: ClosePositionSuccessPopup
    realStockPopup: RealStockPopup
    priceAlert: PriceAlert
    helpPage: HelpPage
    settings: SettingsPage
    verificationPopup: VerificationPopup
    phoneVerification: PhoneVerification
    kycStart: KYC_Start
    quiz: FullRegistration
    KYC_FinalStep: FinalStep
    kycMena: MenaFullRegistration
    kycAfrica: KYC_Africa
    kycStartPopup: StartKYCPopup
    kycUpdatePopup: UdpateAccount

    constructor(page: Page){
        this.page = page
        this.signIn = new SignIn(page);
        this.signUp = new SignUp(page);
        this.mainPage = new MainPage(page);
        this.myAccounts = new MyAccounts(page);
        this.feed = new Feed(page);
        this.userProfile = new UserProfile(page);
        this.KYC_Registration = new KYC_General(page);
        this.addAccount = new AddAcountForm(page) 
        this.autoCopy = new AutoCopy(page)
        this.myTrades = new MyTrades(page)
        this.instruments = new AllInstruments(page)
        this.newPosition = new NewPosition(page)
        this.pageAfterLogin = new PageAfterLogout(page)
        this.forgotPassword = new ForgotPassword(page)
        this.youAreIn = new YouAreInNagaMarkets(page)
        this.personalInformation = new PersonalInformation(page)
        this.guestLogin = new GusetLogin(page)
        this.website = new NagaCom(page)
        this.leaderboard = new Leaderboard(page)
        this.nagaEarn = new NagaEarn(page)
        this.deposit = new Deposit(page)
        this.internalTransfer = new InternalTransfer(page)
        this.withdrawal = new Withdrawal(page)
        this.tradeDetails = new TradeDetails(page)
        this.changeLimitPopup = new ChangeLimitsPopup(page)
        this.changeLimitSuccessPopup = new ChangeLimitSuccessPopup(page)
        this.successfullClosePopup = new ClosePositionSuccessPopup(page)
        this.realStockPopup = new RealStockPopup(page)
        this.priceAlert = new PriceAlert(page)
        this.helpPage = new HelpPage(page)
        this.settings = new SettingsPage(page)
        this.verificationPopup = new VerificationPopup(page)
        this.phoneVerification = new PhoneVerification(page)
        this.kycStart = new KYC_Start(page)
        this.quiz = new FullRegistration(page)
        this.KYC_FinalStep = new FinalStep(page)
        this.kycMena = new MenaFullRegistration(page)
        this.kycAfrica = new KYC_Africa(page)
        this.kycStartPopup = new StartKYCPopup(page)
        this.kycUpdatePopup = new UdpateAccount(page)

    }
}