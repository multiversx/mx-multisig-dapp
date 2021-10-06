import * as React from "react";
import { Link } from "react-router-dom";
import { dAppName } from "config";
import { routeNames } from "routes";
import { ReactComponent as Hero } from "assets/img/home-img.svg";
import union from "assets/img/Union.svg";
import shields from "assets/img/shield.svg";

const Home = () => {
  return (
    <div className="d-flex flex-fill align-items-center container">
      <div className="row w-100">
        <div className="connect col-lg-6 col-sm-6 border-0 d-flex align-items-center">
          <div className="cart-connect">
            <figure>
              <img src={shields} alt="shield-icon" width="64" height="64" />
            </figure>
            <h2 className="mb-3" data-testid="title">
              Security designed to
              <br /> fit your needs.
            </h2>
            <p className="mb-3">
              Elrond Multisig is an ideal balance between security
              <br /> and accessibility.
            </p>
            Enabling clients to move assets seamlessly
            <br /> and reliably, protected by multi-signature security.
            <div className="connect-btns d-flex justify-content-between">
              <div className="connect-btn">
                <Link
                  to={routeNames.unlock}
                  className="btn primary mt-3"
                  data-testid="loginBtn"
                >
                  <span>
                    <img src={union} width="20" height="20" />
                  </span>
                  Connect now
                </Link>
              </div>
              <Link
                to={routeNames.unlock}
                className="d-flex align-items-center mt-3"
                data-testid="loginBtn"
              >
                What is multisig?
              </Link>
            </div>
          </div>
        </div>
        <div className="card-image col-lg-6 col-sm-6">
          <Hero className="home-img" />
        </div>
      </div>
    </div>
  );
};

export default Home;
