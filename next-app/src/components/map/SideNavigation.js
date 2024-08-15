"use client";

import { TbDrone, TbMapPin2 } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";
import Annotations from "./Annotaions";
import { useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const SideNavigation = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const changeRoute = useCallback(
    (view) => () => {
      router.push(`${pathName}?view=${view}`);
    },
    [router]
  );

  useEffect(() => {
    changeRoute("annotations")();
  }, []);

  return (
    <div className="w-content h-full bg-slate-700 text-white shadow-lg flex flex-col justify-between border-t-2 border-slate-500">
      <div className="flex h-full w-96">
        <ul className="border-r-2 w-2/12 border-slate-500 h-full flex flex-col items-center justify-center">
          <button
            className={classNames(
              "w-full hover:text-blue-annotation flex items-center justify-center p-3",
              {
                "bg-white bg-opacity-10":
                  searchParams.get("view") === "annotations",
              }
            )}
            data-tooltip-id="tooltip"
            data-tooltip-content="Map Annotations"
            onClick={changeRoute("annotations")}
          >
            <TbMapPin2
              className={classNames("text-2xl", {
                "text-blue-annotation":
                  searchParams.get("view") === "annotations",
              })}
            />
          </button>
          <button
            className={classNames(
              "w-full hover:text-blue-annotation flex items-center justify-center p-3",
              {
                "bg-white bg-opacity-10":
                  searchParams.get("view") === "devices",
              }
            )}
            data-tooltip-id="tooltip"
            data-tooltip-content="Devices"
            onClick={changeRoute("devices")}
          >
            <TbDrone
              className={classNames("text-2xl", {
                "text-blue-annotation": searchParams.get("view") === "devices",
              })}
            />
          </button>
          <button
            className={
              "w-full hover:text-blue-annotation flex items-center justify-center mt-auto p-3"
            }
            onClick={logout}
            data-tooltip-id="tooltip"
            data-tooltip-content="Log Out"
          >
            <BiLogOut className="text-2xl" />
          </button>
        </ul>
        <div className="h-full w-10/12 overflow-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-tertiary scrollbar-thin">
          <Annotations visible={searchParams.get("view") === "annotations"} />
          {/*  <Devices visible={searchParams.get("view") === "devices"} /> */}
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
