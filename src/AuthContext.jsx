import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("bankUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await fetch(
        "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/customers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const newUser = await response.json();

      const account = {
        accountNumber: "",
        pin: "",
        customerId: newUser.id,
        balance: "",
      };

      const response2 = await fetch(
        "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/accout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(account),
        }
      );
      setCurrentUser(newUser);

      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/customers?email=${email}`
      );
      const customers = await response.json();

      if (customers.length > 0 && customers[0].password === password) {
        localStorage.setItem("bankUser", JSON.stringify(customers[0]));
        setCurrentUser(customers[0]);
        return true; // Success
      }
      return false; // Failure
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };
  const logout = () => {
    localStorage.removeItem("bankUser");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
