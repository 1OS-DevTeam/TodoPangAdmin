import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "src/firebase";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const currentToken = await user.getIdToken();
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken !== currentToken) {
          localStorage.setItem("accessToken", currentToken); // 토큰 동기화
        }

        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
