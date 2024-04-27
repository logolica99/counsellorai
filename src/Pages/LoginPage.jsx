import React, { useContext } from "react";
import Nav from "../Components/Nav";
import { Link, useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase.config";
import { UserContext } from "../contexts/UserContext";

export default function LoginPage() {
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();


  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (typeof window !== "undefined") {
        // browser code
        navigate("/profile");
      }

      // redirect("/auth/login");
    }
  });

  return (
    <div>
      <main className="relative flex min-h-screen flex-col items-center gap-8  pt-40 md:pt-52">
        <Link
          to="/"
          className="bg-red text-white font-semibold px-4 md:px-8 py-1 rounded-lg text-sm md:text-xl"
        >
          Counsellorai
        </Link>
        <div className="rounded-lg border border-cream bg-lightCream p-6 text-center text-darkBlue shadow">
          <p>Sign in with</p>
          <div
            className="my-6 flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-md border border-cream py-3 transition duration-150 ease-in-out hover:bg-zinc-200/20"
            onClick={() => {
         
              signInWithPopup(auth, provider)
                .then((result) => {
        

                  const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                  const token = credential?.accessToken;
                })
                .catch((error) => {
             

                  console.log(error);
                });
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.14 8.92263C17.14 13.8972 13.7366 17.4374 8.71049 17.4374C3.89162 17.4374 0 13.5421 0 8.71872C0 3.8953 3.89162 0 8.71049 0C11.0567 0 13.0306 0.861326 14.5514 2.28163L12.1806 4.56327C9.07928 1.56796 3.31209 3.81796 3.31209 8.71872C3.31209 11.7597 5.73909 14.2242 8.71049 14.2242C12.1596 14.2242 13.4521 11.7492 13.6558 10.466H8.71049V7.46716H17.003C17.0838 7.91365 17.14 8.34255 17.14 8.92263Z"
                fill="#003D61"
              />
            </svg>
            <p className="font-bold">Google</p>
          </div>
          <p className="text-sm text-zinc-500">
            By signing in, you agree to our{" "}
            <span className="cursor-pointer text-primary">
              Terms of Service{" "}
            </span>{" "}
            <br /> and Privacy Policy.
          </p>
        </div>

        {/* <div className="absolute bottom-16 left-0 right-0 p-4 text-center  text-zinc-400 md:bottom-0">
        Made with 💖 by{" "}
        <a
          href="https://github.com/logolica99"
          target="_blank"
          rel="noreferrer"
          className=" text-primary"
        >
          Jubaer Jami
        </a>
      </div> */}
      </main>
    </div>
  );
}
