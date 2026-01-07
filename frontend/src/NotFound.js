import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-animation">
          <div className="notfound-waves">
            <div className="notfound-wave"></div>
            <div className="notfound-wave"></div>
            <div className="notfound-wave"></div>
            <div className="notfound-wave"></div>
            <div className="notfound-wave"></div>
          </div>
        </div>
        
        <h1 className="notfound-title">Oops!</h1>
        <div className="notfound-404">404</div>
        <p className="notfound-message">Page Not Found</p>
        <p className="notfound-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="notfound-buttons">
          <button 
            className="notfound-btn notfound-btn-primary"
            onClick={() => navigate('/home')}
          >
            Go to Home
          </button>
          <button 
            className="notfound-btn notfound-btn-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
