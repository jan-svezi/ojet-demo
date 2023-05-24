import Navigation from "../navigation";
import Page from "./page";

import "ojs/ojdrawerpopup";

type Props = {
    page: string;
    drawerTitle: string;
    drawerOpened: boolean;
    onDrawerClosed: () => void;
}

export default function ContentLayout({ page, drawerTitle, drawerOpened, onDrawerClosed }: Props) {
    return (
        <div>
            <Page page={page} />

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

                    <Navigation page={page} edge="start"/>
                </oj-drawer-popup>
            </div>
        </div>
    );
};
