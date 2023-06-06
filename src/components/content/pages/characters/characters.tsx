import { ComponentProps } from "preact";
import { useMemo, useCallback } from "preact/hooks";

import { ojTable } from "ojs/ojtable";
import { ojButton } from "ojs/ojbutton";

import "ojs/ojtable";
import "ojs/ojbutton";

import { CharacterAPIType, CharacterType } from "./characters-types";

import { RESTDataProvider } from "ojs/ojrestdataprovider";

type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const setSelectionMode: TableProps["selectionMode"] = { row: "single", column: "none" };

const columns: TableProps["columns"] = [
    { headerText: "Greeting", field: "Greeting" },
    { headerText: "Name", field: "Name" },
    { headerText: "Gender", template: "genderTemplate" },
    { headerText: "Homeworld", field: "Homeworld" },
    { headerText: "Born", field: "Born" },
    { headerText: "Is jedi?", field: "Jedi" },
    { headerText: "Created", field: "Created", renderer: (cell) => {
        return {
            insert: cell.row.Created.toLocaleDateString()
        };
    } },
    { headerText: "", template: "actionTemplate" }
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

    const renderActionColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) => {
        const handleEdit = (event: ojButton.ojAction) => {
            event.detail.originalEvent.stopPropagation();
            console.log('edit', cell.row);
        };

        const handleDelete = (event: ojButton.ojAction) => {
            event.detail.originalEvent.stopPropagation();
            console.log('delete', cell.row);
        };

        return [
            <oj-button class="oj-button-sm" onojAction={handleEdit} display="icons">
                <span slot="startIcon" className="oj-ux-ico-edit"></span> Edit
            </oj-button>,

            <oj-button class="oj-button-sm" onojAction={handleDelete} display="icons">
                <span slot="startIcon" className="oj-ux-ico-delete-all"></span> Delete
            </oj-button>
        ];
    }, []);

    const handleCharacterChanged = useCallback((event: ojTable.firstSelectedRowChanged<CharacterType["Name"], CharacterType>) => {
        console.log('show', event.detail.value.data);
    }, []);

    return (
        <div className="oj-flex">
            <oj-table
                aria-label="Alerts"
                data={restDataProvider}
                columnsDefault={setColumnsDefault}
                selectionMode={setSelectionMode}
                columns={columns}
                onfirstSelectedRowChanged={handleCharacterChanged}
                class="oj-bg-body table-sizing oj-flex-item full-height">
                <template slot="genderTemplate" render={renderGenderColumn} />
                <template slot="actionTemplate" render={renderActionColumn} />
            </oj-table>
        </div>
    );
}
