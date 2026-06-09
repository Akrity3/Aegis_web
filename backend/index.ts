import app from "./src/app";
import { PORT } from "./src/configs/constant";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(PORT, () => {
    console.log(`Aegis API running at http://localhost:${PORT}`);
});
