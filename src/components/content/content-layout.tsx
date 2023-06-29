import { h } from "preact";

import "ojs/ojdrawerpopup";

import Navigation from "../navigation";
import Page from "./page";


type Props = {
    page: string;
    setActionArea: (element: h.JSX.Element) => void;
    onPageChanged: (value: string) => void;
    drawerTitle: string;
    drawerOpened: boolean;
    onDrawerClosed: () => void;
    isMediaSM: boolean;
}

export default function ContentLayout({ page, drawerTitle, setActionArea, onPageChanged, drawerOpened, onDrawerClosed, isMediaSM }: Props) {
    return (
        <div>
            <Page page={page} isMediaSM={isMediaSM} setActionArea={setActionArea} />

            <div>
                <oj-drawer-popup opened={drawerOpened}
                                 onopenedChanged={(event) => !event.detail.value && onDrawerClosed()}>
                    <h5 className="oj-flex-bar oj-sm-align-items-center oj-sm-margin-4x-start">
                        {drawerTitle}
                        <oj-button class="oj-flex-bar-end oj-sm-margin-4x-end" display="icons" chroming="outlined"
                                   onojAction={onDrawerClosed}>
                            <span slot="startIcon" className="oj-ux-ico-close"></span> Close
                        </oj-button>
                    </h5>

                    <Navigation page={page} onPageChanged={onPageChanged} displayType="all" edge="start" />
                </oj-drawer-popup>
            </div>
        </div>
    );
};
