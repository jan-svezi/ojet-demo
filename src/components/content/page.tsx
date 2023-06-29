import { h } from "preact";

import Characters from "./pages/characters/characters";
import Battle from "./pages/battle/battle";

type Props = {
    page: string;
    isMediaSM: boolean;
    setActionArea: (element: h.JSX.Element) => void;
};

export default function Page({ page, isMediaSM,  setActionArea }: Props) {
    return (
        <div class="oj-web-applayout-content-nopad oj-web-applayout-content">
            {page === "battle" && <Battle />}
            {page === "characters" && <Characters isMediaSM={isMediaSM} setActionArea={setActionArea} />}
        </div>
    );
};
