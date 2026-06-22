const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const vm = require("vm");
const db = require("./db");

const PORT = Number(process.env.PORT || 8080);
const ROOT = path.resolve(__dirname, "..");
const DB_PATH = path.join(ROOT, "data", "db.json");

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
};

const server = http.createServer(async (request, response) => {
    try {
        const url = new URL(request.url, `http://${request.headers.host}`);

        if (url.pathname.startsWith("/api")) {
            await handleApi(request, response, url);
            return;
        }

        await serveStatic(response, url.pathname);
    } catch (error) {
        sendJson(response, 500, { error: "Error interno del servidor", detail: error.message });
    }
});

server.listen(PORT, () => {
    console.log(`PIAR API y app disponibles en http://localhost:${PORT}`);
});

async function handleApi(request, response, url) {
    if (request.method === "OPTIONS") {
        sendJson(response, 200, { ok: true });
        return;
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
        sendJson(response, 200, { ok: true, service: "PIAR API" });
        return;
    }

    if (request.method === "GET" && url.pathname === "/api/data") {
        sendJson(response, 200, await readDb());
        return;
    }

    if (request.method === "GET" && url.pathname === "/api/estudiantes") {
    db.query(
        "SELECT * FROM estudiantes",
        (err, results) => {
            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 200, results);
        }
    );
    return;
}

if (request.method === "POST" && url.pathname === "/api/estudiantes") {
    const payload = await readJsonBody(request);

    db.query(
        "INSERT INTO estudiantes (nombre, documento, grado) VALUES (?, ?, ?)",
        [payload.nombre, payload.documento, payload.grado],
        (err, result) => {
            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 201, {
                id: result.insertId,
                ...payload
            });
        }
    );

    return;
}


    if (request.method === "PUT" && url.pathname === "/api/data") {
        const payload = await readJsonBody(request);
        await writeDb(payload);
        sendJson(response, 200, payload);
        return;
    }

    if (request.method === "POST" && url.pathname === "/api/reset") {
        const seed = await readSeedData();
        await writeDb(seed);
        sendJson(response, 200, seed);
        return;
    }

   if (request.method === "PUT" && url.pathname.startsWith("/api/estudiantes/")) {

    const id = url.pathname.split("/").pop();
    const payload = await readJsonBody(request);

    db.query(
        "UPDATE estudiantes SET nombre = ?, documento = ?, grado = ? WHERE id = ?",
        [payload.nombre, payload.documento, payload.grado, id],
        (err, result) => {

            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 200, {
                mensaje: "Estudiante actualizado correctamente",
                id: id
            });

        }
    );

    return;
} 

if (request.method === "DELETE" && url.pathname.startsWith("/api/estudiantes/")) {

    const id = url.pathname.split("/").pop();

    db.query(
        "DELETE FROM estudiantes WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 200, {
                mensaje: "Estudiante eliminado correctamente",
                id: id
            });

        }
    );

    return;
}
    sendJson(response, 404, { error: "Ruta API no encontrada" });
}

async function serveStatic(response, pathname) {
    const safePath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.normalize(path.join(ROOT, safePath));

    if (!filePath.startsWith(ROOT)) {
        response.writeHead(403);
        response.end("Acceso denegado");
        return;
    }

    try {
        const file = await fs.readFile(filePath);
        response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
        response.end(file);
    } catch {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Archivo no encontrado");
    }
}

async function readDb() {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8"));
}

async function writeDb(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
}

async function readSeedData() {
    const source = await fs.readFile(path.join(ROOT, "js", "data.js"), "utf8");
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox);
    return sandbox.window.APP_DATA;
}

function sendJson(response, status, data) {
    response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });
    response.end(JSON.stringify(data));
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let body = "";
        request.on("data", chunk => {
            body += chunk;
        });
        request.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
        request.on("error", reject);
    });
}
