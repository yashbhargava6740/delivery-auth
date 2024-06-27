import { initServer } from "./app";
require("dotenv").config();
async function init() {
    const app = await initServer();
    app.listen(process.env.PORT || 8001, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 8001}`);
    });
    app.get("/", (req,res) => {
        res.send("Hello Ji");
    })
}
init();