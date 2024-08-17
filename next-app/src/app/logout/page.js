"use client";

import { useAuth } from "@/hooks/useAuth";

const { useEffect } = require("react");

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return null;
};

export default Logout;
