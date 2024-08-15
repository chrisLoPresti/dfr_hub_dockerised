"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const { useEffect } = require("react");

const Logout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/login");
  }, []);

  return null;
};

export default Logout;
