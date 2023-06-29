import { useRef, useState, useEffect, useCallback, MutableRef } from "preact/hooks";

import { ojDialog } from "ojs/ojdialog";
import { ojInputText } from "ojs/ojinputtext";

import "ojs/ojdialog";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import 'ojs/ojinputtext';
import "ojs/ojswitch";
import "ojs/ojradioset";

import { CharacterType, CharacterAPIType } from "./characters-types";

type Props = {
    character: Partial<CharacterType>;
    readonly: boolean;
    newCharacter: boolean;
    isOpened: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<CharacterAPIType>, dialogRef: MutableRef<ojDialog>, isNew: boolean) => void;
};

export default function CharacterDialog({ character, readonly, newCharacter, isOpened, onClose, onSubmit }: Props) {
    const dialogRef = useRef<ojDialog>();

    const [formData, setFormData] = useState<Partial<CharacterAPIType>>({});

    useEffect(() => {
        isOpened ? dialogRef.current?.open() : dialogRef.current?.close();
    }, [isOpened]);

    const handleValueChanged = useCallback((event: ojInputText.valueChanged) => {
        const key = (event.currentTarget as HTMLInputElement).id.replace(/^CharacterDialog/, '');
        switch (key) {
            case "Jedi": formData.Jedi = event.detail.value ? "yes" : "no"; break;
            case "Name": formData.Name = event.detail.value; break;
            case "Gender": formData.Gender = event.detail.value; break;
            case "Homeworld": formData.Homeworld = event.detail.value; break;
            case "Born": formData.Born = event.detail.value; break;
        }

        setFormData(formData);
    }, [formData]);

    const saveCharacter = useCallback(() => {
        onSubmit(formData as Partial<CharacterAPIType>, dialogRef as MutableRef<ojDialog>, newCharacter);
    }, [formData, newCharacter]);

    return (
        <div>
            <oj-dialog dialogTitle={newCharacter ? "New character" : `${readonly ? "Information about" : "Edit"} "${character.Name}"`}
                       cancelBehavior="icon"
                       ref={dialogRef as MutableRef<ojDialog>}
                       onojClose={onClose}>
                <div slot="body">
                    <oj-form-layout class="oj-formlayout-full-width" direction="row" readonly={readonly}>
                        <oj-input-text id="CharacterDialogName" value={newCharacter ? "" : character.Name} labelHint="Name" onvalueChanged={handleValueChanged} readonly={readonly || !newCharacter} />

                        <oj-radioset id="CharacterDialogGender" class="oj-choice-direction-row" value={newCharacter ? "" : character.Gender} labelHint="Gender" readonly={readonly} onvalueChanged={handleValueChanged}>
                            <oj-option value="female"><span className="oj-ux-ico-female" /></oj-option>
                            <oj-option value="male"><span className="oj-ux-ico-male" /></oj-option>
                        </oj-radioset>

                        <oj-input-text id="CharacterDialogHomeworld" value={newCharacter ? "" : character.Homeworld} labelHint="Homeworld" onvalueChanged={handleValueChanged} readonly={readonly} />
                        <oj-input-text id="CharacterDialogBorn" value={newCharacter ? "" : character.Born} labelHint="Born" onvalueChanged={handleValueChanged} readonly={readonly} />

                        <oj-switch id="CharacterDialogJedi" value={!newCharacter && (character.Jedi === "yes") && true} labelHint="Is character a Jedi?" onvalueChanged={handleValueChanged} readonly={readonly} />
                    </oj-form-layout>
                </div>
                <div slot="footer">
                    <oj-button onojAction={() => onClose()}>Close</oj-button>
                    {!readonly && <oj-button onojAction={saveCharacter}>Save</oj-button>}
                </div>
            </oj-dialog>
        </div>
    );
}
