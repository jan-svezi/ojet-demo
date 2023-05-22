import { useMemo, useCallback, useContext } from "preact/hooks";

import "ojs/ojnavigationlist";
import { ojNavigationList } from "ojs/ojnavigationlist";

import ArrayDataProvider = require("ojs/ojarraydataprovider");

import CoreRouter = require("ojs/ojcorerouter");
import { RouterContext } from "./app";

import { ROUTES } from "./app";
import { RouteType } from "./app-types";

type Props = {
    page: string;
    edge: "start" | "top";
}

export default function Navigation({ page, edge = "start" }: Props) {
    const router = useContext<CoreRouter<CoreRouter.DetailedRouteConfig> | null>(RouterContext);

    const routesDataProvider: ArrayDataProvider<RouteType["path"], RouteType> =
        useMemo(() => new ArrayDataProvider(ROUTES.slice(1), { keyAttributes: "path" }), []);

    const renderNavListItem = useCallback((item: ojNavigationList.ItemContext<RouteType["path"], RouteType>) => {
        return (
            <li>
                <a href="#">
                    <span class={`oj-navigationlist-item-icon ${item.data.detail?.icon}`}></span>
                    <span class="oj-navigationlist-item-label">{item.data.detail?.label}</span>
                </a>
            </li>
        );
    }, []);

    const handlePageChanged = useCallback((event: ojNavigationList.selectionChanged<RouteType["path"], RouteType>) => {
        router?.go({ path: event.detail.value });
    }, []);

    return (
        <oj-navigation-list
            data={routesDataProvider}
            selection={page}
            onselectionChanged={handlePageChanged}
            edge={edge}
            aria-label="Choose a navigation item"
            drill-mode="none">
            <template slot="itemTemplate" render={renderNavListItem} />
        </oj-navigation-list>
    );
}