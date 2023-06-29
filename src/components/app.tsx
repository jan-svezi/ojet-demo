import { createContext } from "preact";
import { useRef, useState, useEffect, useMemo, useCallback } from "preact/hooks";

import { registerCustomElement } from "ojs/ojvcomponent";
import * as ResponsiveUtils from "ojs/ojresponsiveutils";

import CoreRouter = require("ojs/ojcorerouter");
import UrlParamAdapter = require("ojs/ojurlparamadapter");
import Context = require("ojs/ojcontext");

import StarWars from "./star-wars";

import { RouteType } from "./app-types";

export const ROUTES: RouteType[] = [
    { path: "", redirect: "characters" },
    { path: "characters", detail: { label: "Characters", icon: "oj-ux-ico-android" } },
    { path: "battle", detail: { label: "Battle", icon: "oj-ux-ico-crosshair" }},
];

type Props = {
    appName?: string;
    appSubname?: string;
};

export const RouterContext = createContext<CoreRouter<CoreRouter.DetailedRouteConfig> | null>(null);

export const App = registerCustomElement(
    "app-root",
    ({appName = "Star Wars", appSubname = "Battle"}: Props) => {
        // reference to media query API - important to some phone only specific work
        const mediaQueryRef = useRef<MediaQueryList>(
            window.matchMedia(ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY) || "sm-only")
        );

        // component state
        const [isMediaSM, setIsMediaSM] = useState<boolean>(mediaQueryRef.current.matches);
        const [loggedUser, setLoggedUser] = useState<string>("");
        const [page, setPage] = useState<string>(ROUTES.filter(item => item.path == "")[0].redirect as string);

        // make one-time global side effects
        useEffect(() => {
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();

            // get information about logged user - e.g. from API
            setTimeout(() => setLoggedUser("Master Yoda"), 2000);
        }, []);

        // set browser title
        useEffect(() => {
            document.title = `${appName}: ${appSubname}`;
            if (page) {
                const pageData = ROUTES.filter(route => route.path ===  page);
                if (pageData) {
                    document.title = `${pageData[0].detail?.label} | ${document.title}`;
                }
            }
        }, [page, appName, appSubname]);

        // application routing
        const router = useMemo(() => new CoreRouter<CoreRouter.DetailedRouteConfig>(ROUTES, {
            urlAdapter: new UrlParamAdapter()
        }), []);

        // synchronize router state
        useEffect(() => {
            router.sync();
            router.currentState.subscribe((actionable) => {
                if (actionable.state) {
                    setPage(actionable.state.path);
                }
            });
        }, []);

        // watching the media query change - responsiveness of the web
        const handleMediaQueryChange = useCallback((e: MediaQueryListEvent) => {
            setIsMediaSM(e.matches);
        }, []);

        useEffect(() => {
            mediaQueryRef.current.addEventListener("change", handleMediaQueryChange);
            return (() => mediaQueryRef.current.removeEventListener("change", handleMediaQueryChange));
        }, [mediaQueryRef]);

        return (
            <RouterContext.Provider value={router}>
                <div>
                    {loggedUser ?
                        <StarWars appName={appName}
                                  appSubname={appSubname}
                                  loggedUser={loggedUser}
                                  page={page}
                                  isMediaSM={isMediaSM} /> :
                        <h1>Application is loading...</h1>}
                </div>
            </RouterContext.Provider>
        );
    }
);
