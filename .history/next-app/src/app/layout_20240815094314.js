import { Inter } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/atoms/Toast";
import Tooltip from "@/components/atoms/Tooltip";
import { apiInstance } from "@/lib/api";
import { cookies } from "next/headers";
import { AuthProvider } from "@/providers/auth/AuthProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function async RootLayout({ children }) {
  const loadUserFromSession = async () => {
    "use server";
    const sessionCookie = cookies().get("dfr_hub_session");

    if (!sessionCookie) {
      return { user: null, sessionCookie };
    }

    try {
      const res = await apiInstance.get("/api/auth/loaduserfromsession", {
        headers: {
          Cookie: `${sessionCookie.name}=${sessionCookie.value};`,
        },
      });

      return { user: res.data, sessionCookie };
    } catch {
      return { user: null, sessionCookie };
    }
  };
  const session = await loadUserFromSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>{children}</AuthProvider>
        <ToastContainer />
        <Tooltip id="tooltip" className="z-50" />
      </body>
    </html>
  );
}
