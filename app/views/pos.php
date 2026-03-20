<script>

let db;

let request = indexedDB.open("POS_DB", 1);

request.onupgradeneeded = function(e){
    db = e.target.result;

    let store = db.createObjectStore("sales", {
        keyPath: "id",
        autoIncrement: true
    });

    store.createIndex("synced", "synced", { unique: false });
};

request.onsuccess = function(e){
    db = e.target.result;
};

</script>