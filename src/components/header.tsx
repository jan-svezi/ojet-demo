import { h } from "preact";

import "ojs/ojtoolbar";
import "ojs/ojmenu";
import "ojs/ojbutton";

import { StarWarsPropsType } from "./app-types";
import Navigation from "./navigation";

type Props = StarWarsPropsType & {
  actionArea: h.JSX.Element;
  onPageChanged: (value: string) => void;
  onHamburgerClicked: () => void;
};

export default function Header({ appName, appSubname, loggedUser, page, actionArea, onPageChanged, onHamburgerClicked }: Props) {
  return (
    <header role="banner" class="oj-web-applayout-header">
      <div class="oj-flex-bar oj-sm-align-items-center">
        <div class="oj-flex-bar-start">
          <oj-button display="icons" chroming="borderless" onojAction={onHamburgerClicked}>
            <span slot="startIcon" class="oj-ux-ico-menu" />
          </oj-button>
        </div>
        <div class="oj-flex-bar-middle">
          <h1 class="oj-sm-only-hide oj-web-applayout-header-title" title={`${appName} ${appSubname}`}>
            <strong>{appName}</strong> {appSubname}
          </h1>
        </div>
        <div class="oj-flex-bar-end">
          <oj-toolbar>
            <oj-menu-button id="userMenu" chroming="borderless">
              <span slot="startIcon" class="oj-ux-ico-user-configuration" />
              <span>{loggedUser}</span>
              <span slot="endIcon" class="oj-component-icon oj-button-menu-dropdown-icon"></span>
              <oj-menu slot="menu">
                <oj-option value="logout" onClick={() => console.log("User was logged out.")}>
                  <span slot="startIcon" class="oj-ux-ico-door" />
                  Log Out
                </oj-option>
              </oj-menu>
            </oj-menu-button>
          </oj-toolbar>
        </div>
      </div>

      <div className="oj-flex-bar oj-sm-align-items-center oj-sm-only-hide">
        <div className="oj-flex-bar-middle oj-sm-align-items-center">
          {actionArea}
        </div>
        <div className="oj-flex-bar-end oj-sm-only-hide">
          <Navigation page={page} onPageChanged={onPageChanged} displayType="all" edge="top" />
        </div>
      </div>
    </header>
  );  
}
