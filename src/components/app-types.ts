export type StarWarsPropsType = {
    appName: string;
    appSubname: string;
    loggedUser: string;
    page: string;
};

type RouteDescription = {
    label: string;
    icon: string;
}

export type RouteType = {
    path: string;
    detail?: RouteDescription;
    redirect?: string;
}
