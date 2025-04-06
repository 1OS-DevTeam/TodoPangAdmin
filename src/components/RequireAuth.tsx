import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

const RequireAuth = ({ children }: { children: any }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate("/login");
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <div>인증 확인 중...</div>;
  return isAuthenticated ? children : null;
};

export default RequireAuth;
