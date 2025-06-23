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
      const userResponse = await fetch(
        "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/Customers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const newUser = await userResponse.json();

      const accountResponse = await fetch(
        "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: newUser.id }),
        }
      );
      const accountData = await accountResponse.json();

      const updateResponse = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${accountData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountNumber: String(
              Math.floor(1000000000 + Math.random() * 9000000000)
            ),
            balance: Number(10000),
            firstName: userData.firstName,
            lastName: userData.lastName,
            customerId: newUser.id,
            pin: "1234",
          }),
        }
      );
      const updatedAccount = await updateResponse.json();

      const completeUser = {
        ...newUser,
        accountId: updatedAccount.id,
        balance: updatedAccount.balance,
        accountNumber: updatedAccount.accountNumber,
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
      const response = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/Customers?email=${email}`
      );
      const Customers = await response.json();

      if (Customers.length === 0) return false;
      if (Customers[0].password.trim() !== password.trim()) return false;

      const accountResponse = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account?customerId=${Customers[0].id}`
      );
      let accountData = await accountResponse.json();

      if (accountData.length === 0) return false;

      accountData = accountData.map((account) => ({
        ...account,
        balance: account.balance === "" ? 10000 : Number(account.balance),
        firstName: account.firstName.includes("firstName")
          ? Customers[0].firstName
          : account.firstName,
        lastName: account.lastName.includes("lastName")
          ? Customers[0].lastName
          : account.lastName,
      }));

      const completeUser = {
        ...Customers[0],
        accountId: accountData[0].id,
        balance: accountData[0].balance,
        accountNumber: accountData[0].accountNumber,
      };

      setCurrentUser(completeUser);
      localStorage.setItem("bankUser", JSON.stringify(completeUser));
      return true;
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
    updateUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
