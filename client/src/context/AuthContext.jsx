import React, {createContext, useState, useEffect, useContext} from "react";

const AuthContext=createContext();
const API_URL='http://localhost:5000/api/users';

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(()=>{
        const storedUser=localStorage.getItem("user");
        return storedUser?JSON.parse(storedUser):null;
    });

const login=async(email,password)=>{
    const response=await fetch(`${API_URL}/login`,{
        method:"POST",
        headers:{
            "Content-type":"application/json",
        },
        body:JSON.stringify({email,password}),
    });
    const data=await response.json();
    if(response.ok){
        setUser(data);
        localStorage.setItem("user",JSON.stringify(data));
        return data;
    }else{
        throw new Error(data.message || "Login failed");
    }
};

const register = async (name, email, password) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Automatically log in the user after successful registration
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } else {
      throw new Error(data.message || "Registration failed");
    }
  };

const logout=()=>{
    localStorage.removeItem("user");
    setUser(null);
};

const value={
    user,login,logout, register
};
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>{
    return useContext(AuthContext);
};