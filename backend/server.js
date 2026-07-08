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

   if (request.method === "GET" &&
    url.pathname === "/api/data") {

    sendJson(response, 200, await readDbFromMysql());
    return;
    }

    if (request.method === "GET" && url.pathname === "/api/estudiantes") {
        getStudentsFromMysql((err, students) => {
            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 200, students);
        });
        return;
    }

if (request.method === "POST" && url.pathname === "/api/estudiantes") {
    const payload = normalizeStudentPayload(await readJsonBody(request));

    db.query(
        "INSERT INTO estudiante (nombre, documento, edad, curso, condicion_especial) VALUES (?, ?, ?, ?, ?)",
        [payload.nombre, payload.documento, payload.edad, payload.curso, payload.condicion_especial],
        (err, result) => {
            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 201, mapStudentRowToFrontend({
                id_estudiante: result.insertId,
                nombre: payload.nombre,
                documento: payload.documento,
                edad: payload.edad,
                curso: payload.curso,
                condicion_especial: payload.condicion_especial
            }));
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
    const payload = normalizeStudentPayload(await readJsonBody(request));

    db.query(
        "UPDATE estudiante SET nombre = ?, documento = ?, edad = ?, curso = ?, condicion_especial = ? WHERE id_estudiante = ?",
        [payload.nombre, payload.documento, payload.edad, payload.curso, payload.condicion_especial, id],
        (err, result) => {

            if (err) {
                sendJson(response, 500, { error: err.message });
                return;
            }

            sendJson(response, 200, mapStudentRowToFrontend({
                id_estudiante: Number(id),
                nombre: payload.nombre,
                documento: payload.documento,
                edad: payload.edad,
                curso: payload.curso,
                condicion_especial: payload.condicion_especial
            }));

        }
    );

    return;
} 

if (request.method === "DELETE" && url.pathname.startsWith("/api/estudiantes/")) {

    const id = url.pathname.split("/").pop();

    db.query(
        "DELETE FROM estudiante WHERE id_estudiante = ?",
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

            /*****************************************************************
 * OBTENER DATOS DEL SISTEMA DESDE MYSQL
 *****************************************************************/
async function readDbFromMysql() {
    return new Promise((resolve, reject) => {

        getStudentsFromMysql(
            (err, estudiantes) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve({

                    /*********************************************************
                     * DATOS DE LA INSTITUCIÃ“N
                     *********************************************************/
                    institution: {
                        name: "Institucion Educativa Reynaldo Matiz"
                    },

                    /*********************************************************
                     * CONFIGURACIÃ“N DE ACCESO
                     *********************************************************/
                    auth: {
                        validEmail: "guido4574@gmail.com",
                        validPassword: "IRMA4574"
                    },

                    /*********************************************************
                     * ESTUDIANTES
                     *********************************************************/
                    students: estudiantes,

                    /*********************************************************
                     * DOCENTES
                     *********************************************************/
                    teachers: [],

                    /*********************************************************
                     * PIAR
                     *********************************************************/
                    piars: [],

                    /*********************************************************
                     * TIPOS DE REPORTES
                     *********************************************************/
                    reportTypes: [
                        "Seguimiento individual",
                        "PIAR institucional"
                    ],

                    /*********************************************************
                     * DISCAPACIDADES
                     *********************************************************/
                    discapacidades: [
                        "Visual",
                        "Auditiva",
                        "Fisica",
                        "Cognitiva"
                    ],

                    /*********************************************************
                     * GRADOS
                     *********************************************************/
                    grados: [
                        "6A",
                        "6B",
                        "7A",
                        "7B"
                    ],

                    /*********************************************************
                     * ÃREAS
                     *********************************************************/
                    areas: [
                        "Matematicas",
                        "Lenguaje"
                    ]
                });

            }
        );

    });
}
            
/**
 * Obtiene estudiantes desde MySQL y los adapta al contrato funcional del frontend.
 */
function getStudentsFromMysql(callback) {
    db.query(
        "SELECT * FROM estudiante ORDER BY id_estudiante",
        (err, rows) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null, rows.map(mapStudentRowToFrontend));
        }
    );
}

/**
 * Convierte una fila de la tabla estudiante al modelo que consume la SPA oficial.
 */
function mapStudentRowToFrontend(row) {
    const nameParts = splitStudentName(row.nombre);
    const grade = row.curso || "";
    const disability = row.condicion_especial || "Por caracterizar";

    return {
        id: row.id_estudiante,
        id_estudiante: row.id_estudiante,
        nombres: nameParts.nombres,
        apellidos: nameParts.apellidos,
        nombre: row.nombre,
        documento: row.documento,
        fechaNacimiento: "",
        edad: row.edad ?? "",
        grado: grade,
        curso: grade,
        jornada: "",
        discapacidad: disability,
        condicion_especial: disability,
        diagnostico: disability,
        estado: "activo",
        acudiente: "",
        telefono: "",
        contexto: "",
        valoracion: "",
        fortalezas: [],
        barreras: [],
        apoyosRequeridos: [],
        actividadesCasa: ""
    };
}

/**
 * Normaliza datos recibidos desde frontend nuevo o clientes antiguos antes de persistir.
 */
function normalizeStudentPayload(payload) {
    const fullName = [payload.nombres, payload.apellidos].filter(Boolean).join(" ").trim();

    return {
        nombre: payload.nombre || fullName,
        documento: payload.documento,
        edad: payload.edad || null,
        curso: payload.curso || payload.grado || null,
        condicion_especial: payload.condicion_especial || payload.discapacidad || payload.diagnostico || null
    };
}

/**
 * Divide el nombre almacenado actualmente en nombres y apellidos sin modificar MySQL.
 */
function splitStudentName(nombre = "") {
    const parts = nombre.trim().split(/\s+/).filter(Boolean);

    if (parts.length <= 1) {
        return {
            nombres: nombre || "Sin nombre",
            apellidos: ""
        };
    }

    const middle = Math.ceil(parts.length / 2);

    return {
        nombres: parts.slice(0, middle).join(" "),
        apellidos: parts.slice(middle).join(" ")
    };
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

