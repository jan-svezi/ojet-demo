import { ComponentProps } from "preact";
import { useMemo, useCallback } from "preact/hooks";

import { ojTable } from "ojs/ojtable";

import "ojs/ojtable";

import { CharacterAPIType, CharacterType } from "./characters-types";

import { RESTDataProvider } from "ojs/ojrestdataprovider";

type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const columns: TableProps["columns"] = [
    { headerText: "Greeting", field: "Greeting" },
    { headerText: "Name", field: "Name" },
    { headerText: "Gender", field: "Gender", template: "genderTemplate" },
    { headerText: "Homeworld", field: "Homeworld" },
    { headerText: "Born", field: "Born" },
    { headerText: "Is jedi?", field: "Jedi" },
    { headerText: "Created", field: "Created", renderer: (cell) => {
        return {
            insert: cell.row.Created.toLocaleDateString()
        };
    } }
];

const API_ENDPOINT: Readonly<string> = "http://localhost:3333/star-wars";

export default function Characters() {
    const loadCharacter = useCallback((character: CharacterAPIType): CharacterType => {
        return {
            ...character,
            ...{ Created: new Date(character.Created),
                 Greeting: character.Jedi === "yes" ? "May the force be with you..." : "Hi!" }
        } as CharacterType;
    }, []);

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
                    return {
                        data: data.map((row: CharacterAPIType) => loadCharacter(row)),
                        totalSize,
                        hasMore
                    };
                }
            }
        }
    }), []);

    const renderGenderColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) =>
        cell.row.Gender === "female" ? <span className="oj-ux-ico-female" /> : <span className="oj-ux-ico-male" />,
        []);

    return (
        <div className="oj-flex">
            <oj-table
                aria-label="Alerts"
                data={restDataProvider}
                columnsDefault={setColumnsDefault}
                columns={columns}
                class="oj-bg-body table-sizing oj-flex-item full-height">
                <template slot="genderTemplate" render={renderGenderColumn} />
            </oj-table>
        </div>
    );
}
