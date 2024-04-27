import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import { slide as Menu } from "react-burger-menu";
import { UserContext } from "../contexts/UserContext";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading, uid, setUid] = useContext(UserContext);
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);

        if (uid != user.uid) {
          setUid(user.uid);
        }
        // setUser((prev) => ({ ...prev, uid: user.uid }));
        setDisplayName(user.displayName);
        setPhotoUrl(user.photoURL);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  //

  const navigate = useNavigate();

  return (
    <div>
      <div className="flex mt-8 mb-6 w-[90%] mx-auto items-center justify-between ">
        <Link
          to="/"
          className="bg-red text-white font-semibold px-4 md:px-8 py-1 rounded-lg text-sm md:text-xl"
        >
          Counsellorai
        </Link>

        {isLoggedIn ? (
          <div>
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className=" text-darkBlue font-bold px-4 md:px-8 py-2 md:py-3 hover:opacity-45 ease-in-out text-sm md:text-base"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="
               text-red flex items-center gap-2 bg-lightCream font-bold px-4 md:px-6 py-2 md:py-2 hover:opacity-70 rounded-lg ease-in-out text-sm md:text-base"
              >
                <img
                  src={photoUrl}
                  className=" w-6 h-6 rounded-full hidden md:block"
                  alt=""
                />
                <p className="inline">{displayName}</p>
              </Link>

              <Tooltip title="Logout" className="hidden md:inline">
                <button
                  onClick={() => {
                    signOut(auth)
                      .then(() => {
                        navigate("/");
                      })
                      .catch((error) => {
                        // An error happened.
                      });
                  }}
                  className="bg-red text-white px-4 py-2  ml-2 rounded"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </button>
              </Tooltip>
            </div>
            {/* <button className="md:hidden text-xl" onClick={handleMenuToggle}>
              <FontAwesomeIcon icon={faBars} />
            </button> */}
          </div>
        ) : (
          <div>
            <Link
              to="/login"
              className="text-darkBlue font-bold px-4 md:px-8 py-2 md:py-3 hover:opacity-70 ease-in-out text-sm md:text-base rounded-lg"
            >
              LOGIN
            </Link>
            <Link
              to="/login"
              className="text-darkBlue bg-cream font-bold px-4 md:px-8 py-2 md:py-3  hover:opacity-70 ease-in-out text-sm md:text-base rounded-lg"
            >
              SIGN UP
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
