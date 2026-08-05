import { Search } from "lucide-react";


interface Props {
    value: string;
    onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: Props) {
    const TOKENS = {
        ink: "#16241F",
        inkSoft: "#25352D",
        paper: "#F7F5EF",
        paperDim: "#EEEAE0",
        brass: "#C9A227",
        brassDeep: "#A9860F",
        leaf: "#2F6B4F",
        rust: "#B5482D",
        slate: "#5B6660",
        line: "rgba(22,36,31,0.12)",
    };
    const FONT_BODY = "'Space Grotesk', sans-serif";

    return (
       <div style={{ position: "relative", marginBottom: 18, flexShrink: 0 }}>
                     <Search
                       size={16}
                       style={{
                         position: "absolute",
                         left: 16,
                         top: "50%",
                         transform: "translateY(-50%)",
                         opacity: 0.45,
                       }}
                     />
                     <input
                       className="mpos-input"
                       value={value}
                       onChange={(e) => onChange(e.target.value)}
                       placeholder="Scan barcode or search product…"
                       style={{
                         width: "100%",
                         padding: "13px 16px 13px 44px",
                         borderRadius: 10,
                         border: `1.5px solid ${TOKENS.line}`,
                         background: "#fff",
                         fontFamily: FONT_BODY,
                         fontSize: 14.5,
                         color: TOKENS.ink,
                         outline: "none",
                       }}
                     />
                   </div>
    );
}

export default SearchBar;