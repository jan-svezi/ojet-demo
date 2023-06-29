import { h } from "preact";
import { useContext, useState, useCallback } from "preact/hooks";

import Header from "./header";
import ContentLayout from "./content/content-layout";

import CoreRouter = require("ojs/ojcorerouter");
import { RouterContext } from "./app";

import { StarWarsPropsType } from "./app-types";

export default function StarWars({ appName, appSubname, loggedUser, page, isMediaSM }: StarWarsPropsType) {
    const router = useContext<CoreRouter<CoreRouter.DetailedRouteConfig> | null>(RouterContext);

    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
    const [headerActionArea, setHeaderActionArea] = useState<h.JSX.Element>(<div />);

    const handleHamburgerClick = useCallback(() => setDrawerOpened(!drawerOpened), []);

    const handleDrawerClose = useCallback(() => {
        if (drawerOpened) {
            setDrawerOpened(false);
        }
    }, [drawerOpened]);

    const handlePageChange = useCallback((value: string) => {
        handleDrawerClose();
        router?.go({ path: value });
    }, []);

    return (
        <div id="appContainer" className="oj-web-applayout-page">
            <Header appName={appName}
                    appSubname={appSubname}
                    loggedUser={loggedUser}
                    page={page}
                    isMediaSM={isMediaSM}
                    actionArea={headerActionArea}
                    onPageChanged={handlePageChange}
                    onHamburgerClicked={handleHamburgerClick} />

            <ContentLayout page={page}
                           drawerTitle={`${appName}: ${appSubname}`}
                           setActionArea={setHeaderActionArea}
                           onPageChanged={handlePageChange}
                           drawerOpened={drawerOpened}
                           onDrawerClosed={handleDrawerClose}
                           isMediaSM={isMediaSM} />
        </div>
    )
}