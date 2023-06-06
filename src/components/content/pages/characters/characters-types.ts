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
