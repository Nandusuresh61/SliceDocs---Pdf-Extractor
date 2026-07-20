const mongoose = require("mongoose");
const uri = "mongodb+srv://nandusuresh61_db_user:kgprbVP8LPkbnSki@cluster0.jwj6edz.mongodb.net/?appName=Cluster0";
mongoose.connect(uri).then(() => {
    console.log("Connected");
    const doc = mongoose.model("Test", new mongoose.Schema({ name: String }));
    return new doc({ name: "test" }).save();
}).then(() => {
    console.log("Saved");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
