"use client";

import SideNavigation from "@/components/map/SideNavigation";
import { useAuth } from "@/hooks/useAuth";
import { DevicesProvider } from "@/providers/devices/DevicesProvider";
import { SocketProvider } from "@/providers/socket/SocketProvider";

export default function MapLayout({ children }) {
  const { user } = useAuth();

  return (
    <SocketProvider>
      <DevicesProvider>
        <header className="sticky top-0 z-20 h-16 bg-slate-900">
          <div className="flex items-center w-full h-full">
            <p className="text-white ml-auto mr-2.5">
              {user?.first_name} {user?.last_name}
            </p>
          </div>
        </header>
        <div className="flex h-[calc(100vh_-_64px)] relative overflow-hidden bg-slate-700">
          <SideNavigation />
          {children}
        </div>
      </DevicesProvider>
    </SocketProvider>
  );
}
