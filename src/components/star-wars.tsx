import { useState, useCallback } from "preact/hooks";

import "ojs/ojdrawerpopup";

import Header from "./header";
import Content from "./content/index";
import Navigation from "./navigation";

import { StarWarsPropsType } from "./app-types";

export default function StarWars({ appName, appSubname, loggedUser, page }: StarWarsPropsType) {
    const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

    const handleHamburgerClicked = useCallback(() => setDrawerOpened(!drawerOpened), []);

    return (
        <div id="appContainer" className="oj-web-applayout-page">
            <Header appName={appName}
                    appSubname={appSubname}
                    loggedUser={loggedUser}
                    page={page}
                    onHamburgerClicked={handleHamburgerClicked} />
            <Content />

            <div>
                <oj-drawer-popup opened={drawerOpened} onopenedChanged={(event) => !event.detail.value && setDrawerOpened(false)}>
                    <h5 className="oj-flex-bar oj-sm-align-items-center oj-sm-margin-4x-start">
                        {appName}: {appSubname}
                        <oj-button class="oj-flex-bar-end oj-sm-margin-4x-end" display="icons" chroming="outlined" onojAction={() => setDrawerOpened(false)}>
                            <span slot="startIcon" className="oj-ux-ico-close"></span> Close
                        </oj-button>
                    </h5>

                    <Navigation page={page} edge="start" />
                </oj-drawer-popup>
            </div>
        </div>
    )
}