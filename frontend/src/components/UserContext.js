import { createContext, useContext, useEffect, useState } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({ role: "", id: "" });
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("user_token"); // moved inside to ensure fresh read
      if (!token) return;

      try {
        const response = await fetch(`${API_KEY}/api/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo({ role: data.role, id: data.id });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo({ role: "", id: "" }); // reset on error
      }
    };

    fetchUserInfo(); // ✅ this was missing
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
