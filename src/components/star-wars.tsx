import Header from "./header";
import Content from "./content/index";

import { StarWarsPropsType } from "./app-types";

export default function StarWars({ appName, appSubname, loggedUser, page }: StarWarsPropsType) {
    return (
        <div id="appContainer" className="oj-web-applayout-page">
            <Header appName={appName} appSubname={appSubname} loggedUser={loggedUser} page={page} />
            <Content />
        </div>
    )
}