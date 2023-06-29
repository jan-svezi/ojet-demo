import { useMemo, useCallback } from "preact/hooks";

import "ojs/ojnavigationlist";
import { ojNavigationList } from "ojs/ojnavigationlist";

import ArrayDataProvider = require("ojs/ojarraydataprovider");

import { ROUTES } from "./app";
import { RouteType } from "./app-types";

type Props = {
    page: string;
    onPageChanged: (value: string) => void;
    displayType: "icons" | "all";
    edge: "start" | "top";
}

export default function Navigation({ page, onPageChanged = () => undefined, displayType = "icons", edge = "start" }: Props) {
    const routesDataProvider: ArrayDataProvider<RouteType["path"], RouteType> =
        useMemo(() => new ArrayDataProvider(ROUTES.slice(1), { keyAttributes: "path" }), []);

    const handlePageChanged = (event: ojNavigationList.selectionChanged<RouteType["path"], RouteType>) => onPageChanged(event.detail.value);

    const renderNavListItem = useCallback((item: ojNavigationList.ItemContext<RouteType["path"], RouteType>) => {
        return (
            <li>
                <a href="#">
                    <span class={`oj-navigationlist-item-icon ${item.data.detail?.icon}`} />
                    <span class="oj-navigationlist-item-label">{item.data.detail?.label}</span>
                </a>
            </li>
        );
    }, []);

    return (
        <oj-navigation-list
            data={routesDataProvider}
            selection={page}
            onselectionChanged={handlePageChanged}
            edge={edge}
            display={displayType}
            aria-label="Main navigation, select a page"
            drillMode="none">
            <template slot="itemTemplate" render={renderNavListItem} />
        </oj-navigation-list>
    );
}