import { h } from "preact";

import { ComponentProps } from "preact";
import { useState, useEffect, useMemo, useCallback, MutableRef } from "preact/hooks";

import { KeySet, KeySetImpl } from "ojs/ojkeyset";

import { ojDialog } from "ojs/ojdialog";
import { ojTable } from "ojs/ojtable";
import { ojButton } from "ojs/ojbutton";
import { InputSearchElement } from "ojs/ojinputsearch";

import "ojs/ojdialog";
import "ojs/ojtable";
import "ojs/ojbutton";
import "ojs/ojinputsearch";

import CharacterDialog from "./character-dialog";

import { CharacterAPIType, CharacterType, CharacterActionType } from "./characters-types";

import { RESTDataProvider } from "ojs/ojrestdataprovider";
import ListDataProviderView = require("ojs/ojlistdataproviderview");
import { FilterFactory, TextFilter, SortCriterion } from 'ojs/ojdataprovider';

const API_ENDPOINT: Readonly<string> = "http://localhost:3333/star-wars";

type TableProps = ComponentProps<"oj-table">;

const setColumnsDefault: TableProps["columnsDefault"] = { sortable: "disabled" };
const setSelectionMode: TableProps["selectionMode"] = { row: "single", column: "none" };
const setScrollPolicy: TableProps["scrollPolicyOptions"] = { fetchSize: 10, maxCount: 500 };

const columns: TableProps["columns"] = [
    { headerText: "Greeting", field: "Greeting" },
    { headerText: "Name", field: "Name", sortable: "enabled" },
    { headerText: "Gender", template: "genderTemplate" },
    { headerText: "Homeworld", field: "Homeworld", sortable: "enabled" },
    { headerText: "Born", field: "Born" },
    { headerText: "Is jedi?", field: "Jedi", sortable: "enabled" },
    { headerText: "Created", field: "Created", renderer: (cell) => {
        return {
            insert: cell.row.Created.toLocaleDateString()
        };
    } },
    { headerText: "", template: "actionTemplate" }
];

// types
type Props = {
    isMediaSM: boolean;
    setActionArea: (element: h.JSX.Element) => void;
};

export default function Characters({ isMediaSM, setActionArea }: Props) {
    const [selectedCharacter, setSelectedCharacter] = useState<{ row?: KeySet<CharacterType["Name"]> }>();
    const [selectedCharacterData, setSelectedCharacterData] = useState<Partial<CharacterType>>({});
    const [isDialogOpened, setIsDialogOpened] = useState<boolean>(false);
    const [showDetail, setShowDetail] = useState<boolean>(true);
    const [newCharacter, setNewCharacter] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");

    // set section area and handle filtering the table
    useEffect(() => {
        const handleValueChanged = (event: InputSearchElement.rawValueChanged<string, string>) => {
            setFilter(event.detail.value as string);
        };

        setActionArea(
            <oj-form-layout class="oj-md-width-1/2 oj-sm-width-full" columns={2} direction="row">
                <oj-input-search placeholder="Search character" value={filter} onrawValueChanged={handleValueChanged} />
                <oj-button display={isMediaSM ? "icons" : "all"} onojAction={handleCharacterAdd}>
                    Add character <span slot="endIcon" className="oj-ux-ico-plus-circle" />
                </oj-button>
            </oj-form-layout>
        );
    }, [setActionArea, filter]);

    // preprocessing of Star Wars character data
    const loadCharacter = useCallback((character: CharacterAPIType): CharacterType => {
        return {
            ...character,
            ...{ Created: new Date(character.Created),
                Greeting: character.Jedi === "yes" ? "May the force be with you..." : "Hi!" }
        } as CharacterType;
    }, []);

    // initialize RESTDataProvider
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

                    if (options.fetchParameters.filterCriterion) {
                        const filterCriterion = options.fetchParameters.filterCriterion as TextFilter<CharacterAPIType>;
                        if (filterCriterion.text && filterCriterion.text.length >= 2) {
                            url.searchParams.set("filter", filterCriterion.text);
                        }
                    }

                    if (options.fetchParameters.sortCriteria) {
                        const sortCriteria = options.fetchParameters.sortCriteria as SortCriterion<CharacterAPIType>[];

                        // ?sort_by=-last_modified,+email
                        url.searchParams.set("sortBy", sortCriteria.map(
                            column => `${column.direction === "ascending" ? "+" : "-"}${column.attribute}`
                        ).join(","));
                    }

                    return new Request(url.href);
                },
                response: async ({ body }) => {
                    const { totalSize, hasMore, data } = body;
                    return {
                        data: data.map((row: CharacterAPIType) => loadCharacter(row)),
                        totalSize,
                        hasMore
                    }
                }
            }
        }
    }), []);

    // initialize the wrapper of REST DP used to filter and sorting of the data
    const dataProvider: ListDataProviderView<CharacterAPIType["Name"], CharacterAPIType,
        CharacterAPIType["Name"], CharacterAPIType> = useMemo(() =>
            new ListDataProviderView(restDataProvider, {
                filterCriterion: filter ? FilterFactory.getFilter({ filterDef: { text: filter } }) : undefined
            }),
        [filter]
    );

    // handle row selection
    const handleCharacterChanged = useCallback((event: ojTable.firstSelectedRowChanged<CharacterType["Name"], CharacterType>) => {
        // in the case the drawer was closed, the selection was deselected
        if (event.detail.value.key) {
            setSelectedCharacterData(event.detail.value.data);
            showDialog();
        }
    }, []);

    // handle dialog visibility
    const showDialog = useCallback((readonly: boolean = true) => {
        setShowDetail(readonly);
        setIsDialogOpened(true);
    }, []);

    const closeDialog = useCallback(() => {
        setIsDialogOpened(false);
        setSelectedCharacter({ row: new KeySetImpl([]) as KeySet<CharacterType["Name"]> });
        setSelectedCharacterData({});
        setNewCharacter(false);
    }, []);

    // handle other actions
    const handleCharacterAdd = useCallback(() => {
        setNewCharacter(true);
        showDialog(false);
    }, []);

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

    const handleCharacterUpdate = useCallback((data: Partial<CharacterAPIType>, dialogRef: MutableRef<ojDialog>, isNew: boolean) => {
        dialogRef.current?.close();

        // send request and mutate data provider
        (async () => {
            const request = new Request(API_ENDPOINT, {
                headers: new Headers({
                    "Content-type": "application/json; charset=UTF-8",
                }),
                body: JSON.stringify(data),
                method: isNew ? "POST" : "PUT",
            });

            // send request and get added/modified row
            const response = await (await fetch(request)).json();

            // call mutate method to send a mutate event to notify data provider consumer that data has been updated
            if (isNew) {
                restDataProvider.refresh();
            } else {
                // this is currently not working for add
                restDataProvider.mutate({
                    update: {
                        data: [loadCharacter(response)],
                        keys: new Set([response.Name]),
                        metadata: [{ key: response.Name }],
                    },
                });
            }
        })();
    }, []);

    // columns renderers
    const renderGenderColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) =>
            cell.row.Gender === "female" ? <span className="oj-ux-ico-female" /> : <span className="oj-ux-ico-male" />,
        []);

    const renderActionColumn = useCallback((cell: ojTable.CellTemplateContext<CharacterType["Name"], CharacterType>) => {
        const actions: CharacterActionType[] = [
            { action: "edit", label: "Edit", icon: "oj-ux-ico-edit", handler: (event: ojButton.ojAction) => {
                    event.detail.originalEvent.stopPropagation();
                    setSelectedCharacterData(cell.row);
                    showDialog(false);
                }},
            { action: "delete", label: "Delete", icon: "oj-ux-ico-delete-all", handler: (event: ojButton.ojAction) => {
                    event.detail.originalEvent.stopPropagation();
                    handleCharacterDelete(cell.row.Name);
                }}
        ];

        // render actions
        return actions.map((action: CharacterActionType) =>
            <oj-button class="oj-button-sm" onojAction={action.handler} display="icons">
                <span slot="startIcon" className={action.icon}></span> {action.label}
            </oj-button>
        );
    }, []);

    return (
        <div className="oj-flex">
            <oj-table
                aria-label="Alerts"
                data={dataProvider}
                selected={selectedCharacter}
                selectionMode={setSelectionMode}
                onfirstSelectedRowChanged={handleCharacterChanged}
                scrollPolicy="loadMoreOnScroll"
                scrollPolicyOptions={setScrollPolicy}
                columnsDefault={setColumnsDefault}
                columns={columns}
                class="oj-bg-body table-sizing oj-flex-item full-height">
                <template slot="genderTemplate" render={renderGenderColumn} />
                <template slot="actionTemplate" render={renderActionColumn} />
            </oj-table>

            <CharacterDialog character={selectedCharacterData as CharacterType}
                             readonly={showDetail}
                             newCharacter={newCharacter}
                             isOpened={isDialogOpened}
                             onClose={closeDialog}
                             onSubmit={handleCharacterUpdate} />
        </div>
    );
}
