// settingan awal menggunakan express
const express = require("express");
const app = express();
const port = 5000;
const path = require("path"); // untuk menghubungkan file hbs

const dataProject = []; // untuk menampung data

// configuration global
app.set("view engine", "hbs"); // memberitahukan view engine menggunakan hbs
app.set("views", path.join(__dirname, "./views")); // menghubungkan file hbs

// setting middleware untuk membuka folder lainnya
app.use("/assets", express.static(path.join(__dirname, "./assets"))); // membuka folder assets
app.use(express.urlencoded({ extended: false })); // untuk body parse agar dapat menerima data

// route
app.get("/", home); // untuk mengambil halaman home sebagai view
app.get("/project", project); // view
app.get("/editproject/:id", editProject); // view

app.post("/project", addProject); // service add project
app.post("/project/:id", deleteProject); // service delete project
app.post("/submitproject", submitEdit); // service edit project

app.get("/testimonials", testimonials); // view
app.get("/contactform", contact); // view
app.get("/projectpage/:id", projectPage); // view

// service
function home(req, res) {
  res.render("index", { dataProject }); // untuk menampilkan halaman home dan mengambil data
}
function project(req, res) {
  res.render("addProject");
}

function addProject(req, res) {
  // membuat req body untuk menangkap data kemudian parse
  const { project, start, end, desc } = req.body;

  dataProject.unshift({
    project,
    start,
    end,
    desc,
    image:
      "https://images.pexels.com/photos/21624194/pexels-photo-21624194/free-photo-of-a-river-with-boats-and-buildings-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  });

  res.redirect("/");
}
function deleteProject(req, res) {
  const { id } = req.params;
  dataProject.splice(id, 1);

  res.redirect("/");
}
function editProject(req, res) {
  const { id } = req.params;

  const selectedData = dataProject[id];
  selectedData.id = id; // menambahkan object baru

  res.render("editProject", { dataProject: selectedData });
}
function submitEdit(req, res) {
  const { project, start, end, desc, id } = req.body; // mengambil data

  dataProject[id] = { // mengganti dengan data baru
    project,
    start,
    end,
    desc,
  };

  res.redirect("/")
}

function testimonials(req, res) {
  const testimonial = [
    {
      image:
        "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      message:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, nostrum.",
      author: "Rey Mysterio",
      rating: 3,
    },
    {
      image:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, veritatis obcaecati.",
      author: "Brie Bella",
      rating: 5,
    },
    {
      image:
        "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum?",
      author: "Randy Orton",
      rating: 3,
    },
    {
      image:
        "https://images.pexels.com/photos/1182825/pexels-photo-1182825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      message:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat natus adipisci laudantium? At, odit ducimus?",
      author: "Undertaker",
      rating: 2,
    },
    {
      image:
        "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      message:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. veritatis obcaecati.",
      author: "Lita Company",
      rating: 4,
    },
    {
      image:
        "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      message:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. At, odit ducimus?",
      author: "Stephanie McMahon",
      rating: 4,
    },
  ];

  res.render("testimonials", { testimonial: testimonial });
}
function contact(req, res) {
  res.render("contactForm");
}
function projectPage(req, res) {
  const { id } = req.params;
  res.render("projectPage");
}

app.listen(port, () => {
  console.log("server runing");
});
