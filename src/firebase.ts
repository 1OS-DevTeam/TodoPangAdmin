import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8seLWRR8Ynwowcp-MklIGJP_GvXzJ42o",
  authDomain: "teamplan-378214.firebaseapp.com",
  projectId: "teamplan-378214",
  storageBucket: "teamplan-378214.firebasestorage.app",
  messagingSenderId: "861413417966",
  appId: "1:861413417966:web:de8ba63320e77f2d9be4ff",
  measurementId: "G-FVQRZ7TDMR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
