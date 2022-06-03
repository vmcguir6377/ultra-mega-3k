const Express = require (express);
const sql = require (sql);

const app = express();
app.use(express.json);

const db = sql.createConnection({
user: "sa",
host: "ts.unitedlocating.net",
password: "ulsdbadmin",
database: "employeeData"

});

app.post("/register", (req, res) => {
    const userName = req.body.userName

    db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    );
    
});