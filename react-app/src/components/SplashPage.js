import LoginForm from "./auth/LoginForm";
import SignUpForm from "./auth/SignUpForm";
import './CSS/SplashPage.css'

const HomePage = () => {
  return (
    <div className="home-page-main-container">
      <div className="home-page-left-container">
        <div className="home-page-title">The #1 software</div>
        <div className="home-page-title">development tool</div>
        <div className="home-page-title">used by agile teams</div>
        <ul className="home-page-subTitle">
          <li><i className="fa-sharp fa-solid fa-check" id="home-page-checkmark"></i>{" "}Collaborate, manage projects, and reach new productivity peaks.</li>
          <li><i className="fa-sharp fa-solid fa-check" id="home-page-checkmark"></i>{" "}From high rises to the home office.</li>
          <li><i className="fa-sharp fa-solid fa-check" id="home-page-checkmark"></i>{" "}Is always free, no credit card needed</li>
        </ul>
      </div>

      <LoginForm />

    </div>
  )
}

export default HomePage;
