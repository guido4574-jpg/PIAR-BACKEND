const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "piar",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión:", err);
        return;
    }

    console.log("✅ Conectado a MySQL");
});

module.exports = db;
