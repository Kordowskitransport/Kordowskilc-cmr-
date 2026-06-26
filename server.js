const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT
        )
    `);
});

const SECRET = "KORDOWSKI_SECRET_2026";

app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.run(
        "INSERT INTO users(email,password,role) VALUES(?,?,?)",
        [email, hash, "driver"],
        function (err) {
            if (err)
                return res.status(400).json({
                    message: "Użytkownik już istnieje"
                });

            res.json({
                message: "Konto utworzone"
            });
        }
    );
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, user) => {
            if (!user)
                return res.status(401).json({
                    message: "Nieprawidłowe dane"
                });

            const ok = await bcrypt.compare(
                password,
                user.password
            );

            if (!ok)
                return res.status(401).json({
                    message: "Nieprawidłowe dane"
                });

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                SECRET,
                {
                    expiresIn: "7d"
                }
            );

            res.json({
                token,
                role: user.role
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Serwer działa.");
});
const bcrypt = require("bcryptjs");

async function createAdmin() {
    const hash =
        await bcrypt.hash("Kordowskidebi1123", 10);

    db.run(
        `
        INSERT OR IGNORE INTO users
        (id,email,password,role)
        VALUES
        (1,
        'RobertPolak@gmail.com',
        ?,
        'admin')
        `,
        [hash]
    );
}

createAdmin();
db.run(`
CREATE TABLE IF NOT EXISTS cmr (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nadawca TEXT,
    odbiorca TEXT,
    zaladunek TEXT,
    rozladunek TEXT,
    towar TEXT,
    waga TEXT,
    oplata TEXT
)
`);app.post("/api/cmr", (req,res)=>{

    const {
        nadawca,
        odbiorca,
        zaladunek,
        rozladunek,
        towar,
        waga,
        oplata
    } = req.body;

    db.run(
        `
        INSERT INTO cmr
        (
            nadawca,
            odbiorca,
            zaladunek,
            rozladunek,
            towar,
            waga,
            oplata
        )
        VALUES (?,?,?,?,?,?,?)
        `,
        [
            nadawca,
            odbiorca,
            zaladunek,
            rozladunek,
            towar,
            waga,
            oplata
        ]
    );

    res.json({
        message:"CMR zapisane"
    });
});
app.get("/api/cmr", (req,res)=>{

    db.all(
        "SELECT * FROM cmr ORDER BY id DESC",
        [],
        (err, rows)=>{
            if(err){
                return res.status(500).json({
                    message:"Błąd bazy"
                });
            }

            res.json(rows);
        }
    );

});
db.run(`
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    truck TEXT
)
`);
app.post("/api/drivers",(req,res)=>{

    const {
        name,
        email,
        phone,
        truck
    } = req.body;

    db.run(
        `
        INSERT INTO drivers
        (
            name,
            email,
            phone,
            truck
        )
        VALUES (?,?,?,?)
        `,
        [
            name,
            email,
            phone,
            truck
        ]
    );

    res.json({
        message:"Kierowca dodany"
    });

});
app.get("/api/drivers",(req,res)=>{

    db.all(
        "SELECT * FROM drivers",
        [],
        (err,rows)=>{
            res.json(rows);
        }
    );

});
