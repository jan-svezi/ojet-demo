import { ComponentProps } from "preact";
import { useMemo } from "preact/hooks";

import "ojs/ojtable";

import { CharacterAPIType } from "./characters-types";

import { RESTDataProvider } from "ojs/ojrestdataprovider";

type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const columns: TableProps["columns"] = [
    { headerText: "Name", field: "Name" },
    { headerText: "Gender", field: "Gender" },
    { headerText: "Homeworld", field: "Homeworld" },
    { headerText: "Born", field: "Born" },
    { headerText: "Is jedi?", field: "Jedi" },
    { headerText: "Created", field: "Created" }
];

const API_ENDPOINT: Readonly<string> = "http://127.0.0.1:3333/star-wars";

export default function Characters() {
    const restDataProvider: RESTDataProvider<CharacterAPIType["Name"], CharacterAPIType> = useMemo(() => new RESTDataProvider({
        keyAttributes: "Name",
        url: API_ENDPOINT,
        transforms: {
            fetchFirst: {
                request: async (options) =>  {
                    const url = new URL(options.url);

                    const { size, offset } = options.fetchParameters;
                    url.searchParams.set("limit", String(size));
                    url.searchParams.set("offset", String(offset));

                    return new Request(url.href);
                },
                response: async ({ body }) => {
                    const { totalSize, hasMore, data } = body;
                    return { data, totalSize, hasMore };
                }
            }
        }
    }), []);

    return (
        <div className="oj-flex">
            <oj-table
                aria-label="Alerts"
                data={restDataProvider}
                columnsDefault={setColumnsDefault}
                columns={columns}
                class="oj-bg-body table-sizing oj-flex-item full-height">
            </oj-table>
        </div>
    );
}
