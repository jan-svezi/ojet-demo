export type StarWarsPropsType = {
    appName: string;
    appSubname: string;
    loggedUser: string;
    page: string;
};

type RouteDescriptionType = {
    label: string;
    icon: string;
}

export type RouteType = {
    path: string;
    detail?: RouteDescriptionType;
    redirect?: string;
}
