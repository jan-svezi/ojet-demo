import { createContext } from "preact";
import { useState, useEffect, useMemo } from "preact/hooks";

import { registerCustomElement } from "ojs/ojvcomponent";

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
        const [loggedUser, setLoggedUser] = useState<string>("");
        const [page, setPage] = useState<string>(ROUTES.filter(item => item.path == "")[0].redirect as string)

        const router = useMemo(() => new CoreRouter<CoreRouter.DetailedRouteConfig>(ROUTES, {
            urlAdapter: new UrlParamAdapter()
        }), []);

        useEffect(() => {
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();

            // get information about logged user - e.g. from API
            setTimeout(() => setLoggedUser("Master Yoda"), 2000);
        }, []);

        // synchronize router state
        useEffect(() => {
            router.sync();
            router.currentState.subscribe((actionable) => {
                if (actionable.state) {
                    setPage(actionable.state.path);
                }
            });
        }, []);

        return (
            <RouterContext.Provider value={router}>
                <div>
                    {loggedUser ?
                        <StarWars appName={appName} appSubname={appSubname} loggedUser={loggedUser} page={page} /> :
                        <h1>Application is loading...</h1>}
                </div>
            </RouterContext.Provider>
        );
    }
);
