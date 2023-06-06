import { ComponentProps } from "preact";
import { useState, useMemo, useCallback, useRef, MutableRef, useEffect } from "preact/hooks";

import { ojTable } from "ojs/ojtable";
import { ojButton } from "ojs/ojbutton";
import { ojDialog } from "ojs/ojdialog";

import "ojs/ojtable";
import "ojs/ojbutton";
import "ojs/ojdialog";

import { CharacterAPIType, CharacterType } from "./characters-types";

import { RESTDataProvider } from "ojs/ojrestdataprovider";

type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const setSelectionMode: TableProps["selectionMode"] = { row: "single", column: "none" };
const setScrollPolicy: TableProps["scrollPolicyOptions"] = { fetchSize: 10, maxCount: 500 };

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
    const dialogRef = useRef<ojDialog>();
    const [dialogOpened, setDialogOpened] = useState<"show" | "hide" | undefined>("hide");

    useEffect(() => {
        dialogOpened === "show" ? dialogRef.current?.open() : dialogRef.current?.close();
    }, [dialogOpened]);

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

    const handleCharacterChanged = useCallback((event: ojTable.firstSelectedRowChanged<CharacterType["Name"], CharacterType>) => {
        setDialogOpened("show");
        console.log('show', event.detail.value.data);
    }, []);

    const renderGenderColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) =>
            cell.row.Gender === "female" ? <span className="oj-ux-ico-female" /> : <span className="oj-ux-ico-male" />,
        []);

    const handleCharacterDelete = useCallback((name: string) => {
        if (confirm("Oooooh! Looks like the Force wasn't with you on this one!")) {
            (async () => {
                const request = new Request(API_ENDPOINT + '/' + name, {
                    headers: new Headers({
                        "Content-type": "application/json; charset=UTF-8"
                    }),
                    method: "DELETE"
                });

                const response: CharacterAPIType = await (await fetch(request)).json();

                restDataProvider.mutate({
                    remove: {
                        data: [loadCharacter(response)],
                        keys: new Set([response.Name]),
                        metadata: [{key: response.Name}]
                    }
                });
            })();
        }
    }, []);

    const renderActionColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) => {
        const handleEdit = (event: ojButton.ojAction) => {
            event.detail.originalEvent.stopPropagation();
            console.log('edit', cell.row);
        };

        const handleDelete = (event: ojButton.ojAction) => {
            event.detail.originalEvent.stopPropagation();
            handleCharacterDelete(cell.row.Name);
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

    return (
        <div className="oj-flex">
            <oj-table
                aria-label="Alerts"
                data={restDataProvider}
                columnsDefault={setColumnsDefault}
                selectionMode={setSelectionMode}
                scrollPolicy="loadMoreOnScroll"
                scrollPolicyOptions={setScrollPolicy}
                columns={columns}
                onfirstSelectedRowChanged={handleCharacterChanged}
                class="oj-bg-body table-sizing oj-flex-item full-height">
                <template slot="genderTemplate" render={renderGenderColumn} />
                <template slot="actionTemplate" render={renderActionColumn} />
            </oj-table>

            <div>
                <oj-dialog dialog-title="Modal Dialog"
                           aria-describedby="desc"
                           ref={dialogRef as MutableRef<ojDialog>}>
                    <div slot="body">
                        <p id="desc">
                            This is the dialog content. User can change dialog resize behavior, cancel behavior and drag
                            behavior by setting attributes. Default attribute value depends on the theme.
                        </p>
                    </div>
                    <div slot="footer">
                        <oj-button id="okButton">OK</oj-button>
                    </div>
                </oj-dialog>
            </div>
        </div>
    );
}
