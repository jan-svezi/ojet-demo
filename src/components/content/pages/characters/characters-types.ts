import { ojButton } from "ojs/ojbutton";

export type CharacterAPIType = {
    Name: string;
    Gender: string;
    Homeworld: string;
    Born: string;
    Jedi: string;
    Created: string;
};

export type CharacterType = CharacterAPIType & {
    Created: Date;
    Greeting: string;
};

export type CharacterActionType = {
    action: string;
    label: string;
    icon: string;
    handler: (event: ojButton.ojAction) => void;
};
