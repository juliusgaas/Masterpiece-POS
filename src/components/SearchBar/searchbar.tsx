import {
    Search,
    Barcode,
    ScanBarcode,
    Plus,
} from "lucide-react";
import "./SearchBar.css";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSearch?: () => void;
    onScan?: () => void;
    onQuickProduct?: () => void;
}

function SearchBar({
    value,
    onChange,
    onSearch,
    onScan,
    onQuickProduct,
}: Props) {

    return (
        <div className="product-search">

            {/* BARCODE MODE */}
            <button
                type="button"
                className="barcode-btn"
                title="Barcode Scanner"
                onClick={onScan}
            >
                <Barcode size={18} />
            </button>


            {/* SEARCH INPUT */}
            <div className="search-input-wrapper">

                <Search
                    className="search-icon"
                    size={16}
                />

                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSearch?.();
                        }
                    }}
                    placeholder="Scan barcode or search product..."
                />

                <span className="shortcut">
                    Ctrl + K
                </span>

            </div>


            {/* SEARCH BUTTON */}
            <button
                type="button"
                className="search-btn"
                onClick={onSearch}
            >
                <Search size={17} />
                <span>Search</span>
            </button>


            {/* SCAN */}
            <button
                type="button"
                className="action-btn"
                onClick={onScan}
            >
                <ScanBarcode size={17} />
                <span>Scan</span>
            </button>


            {/* QUICK PRODUCT */}
            <button
                type="button"
                className="action-btn"
                onClick={onQuickProduct}
            >
                <Plus size={17} />
                <span>Quick Product</span>
            </button>

        </div>
    );
}

export default SearchBar;