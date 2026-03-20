<script>

function syncOffline(){

    if(!navigator.onLine || !db) return;

    let tx = db.transaction("sales", "readwrite");
    let store = tx.objectStore("sales");

    let request = store.getAll();

    request.onsuccess = function(){

        let data = request.result;

        data.forEach(sale => {

            if(sale.synced === 0){

                fetch('index.php?page=pos-checkout',{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({cart: sale.cart})
                })
                .then(() => {

                    sale.synced = 1;
                    store.put(sale);

                    console.log("Synced:", sale.id);

                });

            }

        });

    };
}

// auto sync every 5 seconds
setInterval(syncOffline, 5000);

</script>