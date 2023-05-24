import { useState, useCallback } from "preact/hooks";

import Header from "./header";
import ContentLayout from "./content/content-layout";

import { StarWarsPropsType } from "./app-types";

export default function StarWars({ appName, appSubname, loggedUser, page }: StarWarsPropsType) {
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

    const handleDrawerClose = useCallback(() => {
        if (drawerOpened) {
            setDrawerOpened(false);
        }
    }, [drawerOpened]);

    const handleHamburgerClick = useCallback(() => setDrawerOpened(!drawerOpened), []);

    return (
        <div id="appContainer" className="oj-web-applayout-page">
            <Header appName={appName}
                    appSubname={appSubname}
                    loggedUser={loggedUser}
                    page={page}
                    onHamburgerClicked={handleHamburgerClick} />

            <ContentLayout page={page}
                           drawerTitle={`${appName}: ${appSubname}`}
                           drawerOpened={drawerOpened}
                           onDrawerClosed={handleDrawerClose} />
        </div>
    )
}