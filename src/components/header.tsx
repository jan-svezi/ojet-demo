import "ojs/ojtoolbar";
import "ojs/ojmenu";
import "ojs/ojbutton";

import { StarWarsPropsType } from "./app-types";
import Navigation from "./navigation";

export default function Header({ appName, appSubname, loggedUser, page }: StarWarsPropsType) {
  return (
    <header role="banner" class="oj-web-applayout-header">
      <div class="oj-flex-bar oj-sm-align-items-center">
        <div class="oj-flex-bar-start">
          <oj-button display="icons" chroming="borderless"><span slot="startIcon" class="oj-ux-ico-menu" /></oj-button>
        </div>
        <div class="oj-flex-bar-middle oj-sm-align-items-baseline">
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
                <oj-option value="out" onClick={() => console.log("User was logged out.")}>
                  <span slot="startIcon" class="oj-ux-ico-door" />
                  Sign Out
                </oj-option>
              </oj-menu>
            </oj-menu-button>
          </oj-toolbar>
        </div>
      </div>

      <div class="oj-sm-only-hide">
        <Navigation page={page} edge="top" />
      </div>
    </header>
  );  
}
