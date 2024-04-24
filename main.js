// settingan awal menggunakan express
const express = require("express");
const app = express();
const port = 5000;
const path = require("path"); // untuk menghubungkan file hbs

const data = []; // untuk menampung data

// configuration global
app.set("view engine", "hbs"); // memberitahukan view engine menggunakan hbs
app.set("views", path.join(__dirname, "./views")); // menghubungkan file hbs

// setting middleware untuk membuka folder lainnya
app.use("/assets", express.static(path.join(__dirname, "./assets"))); // membuka folder assets
app.use(express.urlencoded({ extended: false })); // untuk body parse agar dapat menerima data

// route
app.get("/", home); // untuk mengambil halaman home
app.get("/addproject", project);
app.post("/addproject", addproject);
app.get("/testimonials", testimonials);
app.get("/contactform", contact);
// app.get("/projectpage/:id", project);

// service
function home(req, res) {
  res.render("index"); // untuk menampilkan halaman home
}
function project(req, res) {
  res.render("addProject", { data: data });
}
function addproject(req, res) {
  // membuat req body untuk menangkap data kemudian parse
  const { project, start, end, description, technologies, image, duration } =
    req.body;

  data.unshift({
    project,
    start,
    end,
    description,
    technologies,
    image,
    duration,
  });

  res.redirect("addproject");
}
function testimonials(req, res) {
  res.render("testimonials");
}
function contact(req, res) {
  res.render("contactForm");
}
// function project(req, res) {
//   res.render("projectPage");
// }

app.listen(port, () => {
  console.log("server runing");
});
