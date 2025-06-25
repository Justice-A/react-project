import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

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
  const updateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem("bankUser", JSON.stringify(updatedUser));
    return updatedUser;
  };
  const register = async (userData) => {
    try {
      // 1. Generate account number FIRST
      const newAccountNumber = String(
        Math.floor(1000000000 + Math.random() * 9000000000)
      );

      // 2. Create user
      const userResponse = await fetch(
        "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/Customers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...userData,
            accountNumber: newAccountNumber, // Store in Customer too
          }),
        }
      );
      const newUser = await userResponse.json();

      // 3. Create account WITH number in initial POST
      const accountResponse = await fetch(
        "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: newUser.id,
            accountNumber: newAccountNumber, // Same number
            balance: 10000,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            pin: "1234",
          }),
        }
      );
      const accountData = await accountResponse.json();

      // 4. FORCE verification
      if (accountData.accountNumber !== newAccountNumber) {
        console.error("API corrupted our account number!", {
          sent: newAccountNumber,
          received: accountData.accountNumber,
        });
        throw new Error("API failed to save account number");
      }

      // 5. Final user object
      const completeUser = {
        ...newUser,
        accountId: accountData.id,
        balance: 10000,
        accountNumber: newAccountNumber, // Use original, not API response
      };

      setCurrentUser(completeUser);
      localStorage.setItem("bankUser", JSON.stringify(completeUser));
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };
  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email, password });
      // 1. Find user
      const userResponse = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/Customers?email=${encodeURIComponent(
          email
        )}`
      );

      const users = await userResponse.json();
      console.log("Users found:", users);
      if (!users.length) return false;

      const user = users[0];
      const storedPassword = user.password || "";
      if (storedPassword.trim().localeCompare(password.trim())) {
        console.error("Password mismatch");
        return false;
      }

      // 2. Get account with proper error handling
      const accountResponse = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account?customerId=${user.id}`
      );
      const accounts = await accountResponse.json();
      console.log("Accounts found:", accounts); // Debug log

      if (!accounts.length) {
        console.error("No accounts found for user");
        return false;
      }

      const account = accounts[0];
      console.log("Using account:", account); // Debug log

      // 3. Create user object with proper type conversion
      const completeUser = {
        ...user,
        accountId: account.id,
        balance: 10000, // Force the correct balance
        accountNumber: user.accountNumber || "GENERATED_" + user.id.slice(0, 5),
      };

      console.log("Complete user:", completeUser); // Debug log

      setCurrentUser(completeUser);
      localStorage.setItem("bankUser", JSON.stringify(completeUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
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
    updateUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
