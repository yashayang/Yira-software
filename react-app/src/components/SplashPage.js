import LoginForm from "./auth/LoginForm";
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
        <div className="social-container">Created By <span className="my-name">Yasha Yang</span>
        <a href='https://github.com/yashayang' className="social-link" target="_blank" rel="noreferrer" ><span><i className="fa-brands fa-github"></i></span></a>
        <a href='https://www.linkedin.com/in/yashayang/' className="social-link" target="_blank" rel="noreferrer" ><span><i class="fa-brands fa-linkedin"></i></span></a>
        </div>
      </div>

      <LoginForm />

    </div>
  )
}

export default HomePage;
