import Characters from "./pages/characters/characters";
import Battle from "./pages/battle/battle";

type Props = {
    page: string;
};

export default function Page({ page }: Props) {
    return (
        <div class="oj-web-applayout-content-nopad oj-web-applayout-content">
            {page === "battle" && <Battle />}
            {page === "characters" && <Characters />}
        </div>
    );
};
