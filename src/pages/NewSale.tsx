import useOnlineStatus from "../hooks/useOnlineStatus";
import SearchBar from "../components/SearchBar/searchbar";
import { ProductService } from "../services/ProductService";
import { db } from "../database/dexie";
import { useEffect, useState } from "react";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import Pagination from "../components/Pagination/Pagination";
import Cart from "../components/Cart/Cart";
import Footer from "../components/Footer/footer";
import ProductTable from "../components/table-grid-product/page";



function NewSale() {
    const online = useOnlineStatus();

    const [products, setProducts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [cart, setCart] = useState<any[]>([]);
const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    const PAGE_SIZE = 12;



    // Fetch products and update local database
    useEffect(() => {
        syncProductsOnline();
        loadProducts(page);
    }, []);

    const nextPage = async () => {
        const next = page + 1;
        setPage(next);
        await loadProducts(next);
    };

    const previousPage = async () => {
        if (page === 1) return;
        const prev = page - 1;
        setPage(prev);
        await loadProducts(prev);
    };

    const syncProductsOnline = async () => {
        try {
            // Online Sync
            if (online) {
                const response: any = await ProductService.getProducts();
                if (response.data.success) {
                    await db.products.clear();
                    await db.products.bulkPut(response.data.data);
                    loadProducts(page);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const loadProducts = async (page = 1) => {

        try {
            const offset = (page - 1) * PAGE_SIZE;

            // Load from IndexedDB
            const localProducts = await db.products
                .orderBy("name")
                .offset(offset)
                .limit(PAGE_SIZE)
                .toArray();

            setProducts(localProducts);

        } catch (error) {
            console.error(error);
        }
    };


    // Search Products
    const searchProducts = async (keyword: string) => {
        setSearch(keyword);
        if (!keyword.trim()) {
            const all = await db.products
                .limit(PAGE_SIZE)
                .toArray();
            setProducts(all);
            return;
        }

        const byName = await db.products
            .where("name")
            .startsWithIgnoreCase(keyword)
            .limit(PAGE_SIZE)
            .toArray();

        const byCode = await db.products
            .where("item_code")
            .startsWithIgnoreCase(keyword)
            .limit(PAGE_SIZE)
            .toArray();

        const merged = [...byName];

        byCode.forEach(item => {
            if (!merged.find(p => p.id === item.id)) {
                merged.push(item);
            }
        });

        setProducts(merged);
    };

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            subtotal:
                                (item.quantity + 1) *
                                Number(item.selling_price)
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    quantity: 1,
                    subtotal: Number(product.selling_price)
                }
            ];
        });
    };

    const increaseQty = (id: number) => {

        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal:
                            (item.quantity + 1) *
                            Number(item.selling_price)
                    }
                    : item
            )
        );
    };

    const decreaseQty = (id: number) => {

        setCart(prev =>
            prev
                .map(item =>
                    item.id === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            subtotal:
                                (item.quantity - 1) *
                                Number(item.selling_price)
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );

    };

    const removeItem = (id: number) => {

        setCart(prev =>
            prev.filter(item => item.id !== id)
        );

    };

    return (
        <div className="app">


            <div className="container-fluid">
                <div className="row content-container" style={{ paddingTop: 20 }}>
                    <div className="col-md-8">
                        <SearchBar
                            value={search}
                            onChange={searchProducts}
                        />

                        {/* VIEW SWITCH */}
                        <div className="d-flex justify-content-end mt-3 mb-3">
                            <div className="btn-group" role="group">

                                <button
                                    type="button"
                                    className={`btn btn-sm ${viewMode === "grid"
                                            ? "btn-success"
                                            : "btn-outline-secondary"
                                        }`}
                                    onClick={() => setViewMode("grid")}
                                    title="Grid View"
                                >
                                    ▦
                                </button>

                                <button
                                    type="button"
                                    className={`btn btn-sm ${viewMode === "table"
                                            ? "btn-success"
                                            : "btn-outline-secondary"
                                        }`}
                                    onClick={() => setViewMode("table")}
                                    title="Table View"
                                >
                                    ☷
                                </button>

                            </div>
                        </div>

                        <div className="mt-3">
                            {viewMode === "grid" ? (
                                <ProductGrid
                                    products={products}
                                    onSelect={addToCart}
                                />
                            ) : (
                                <ProductTable
                                    products={products}
                                    onSelect={addToCart}
                                />
                            )}
                        </div>

                        <Pagination
                            page={page}
                            hasPrevious={page > 1}
                            hasNext={products.length === 12}
                            onPrevious={previousPage}
                            onNext={nextPage}
                        />




                    </div>
                    {/* Recent Sales */}
                    <div className="col-md-4">


                        <Cart
                            items={cart}
                            onIncrease={increaseQty}
                            onDecrease={decreaseQty}
                            onRemove={removeItem}
                            onClear={() => setCart([])}
                        />


                    </div>
                    <Footer online={online} />
                </div>
            </div>
        </div>
    );
}


export default NewSale;