// settingan awal menggunakan express
const express = require("express");
const app = express();
const port = 5000;
const path = require("path"); // untuk menghubungkan file hbs

const config = require("./config/config.json"); // untuk import database
const { Sequelize, QueryTypes, where } = require("sequelize");
const { SELECT } = require("sequelize/lib/query-types");
const sequelize = new Sequelize(config.development);

const projectModel = require("./models").project; // untuk menggunakan ORM
const userModel = require("./models").user;

const bcrypt = require("bcrypt"); // untuk import membuat hashing

const session = require("express-session"); // untuk import membuat session

const dataProject = []; // untuk menampung data ,jika sudah menggunakan database ini tidak digunakan

// configuration global
app.set("view engine", "hbs"); // memberitahukan view engine menggunakan hbs
app.set("views", path.join(__dirname, "./views")); // menghubungkan file hbs

// setting middleware untuk membuka folder lainnya
app.use("/assets", express.static(path.join(__dirname, "./assets"))); // membuka folder assets
app.use(express.urlencoded({ extended: false })); // untuk body parse agar dapat menerima data

app.use(
  // membuat configuration session
  session({
    name: "session",
    secret: "RAHASIA",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

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
app.get("/register", registerView); // view
app.get("/login", loginView); // view

app.post("/register", register); // service register
app.post("/login", login); // service login
app.post("/logout", logout) // service logout

// service
function registerView(req, res) {
  res.render("register");
}
function loginView(req, res) {
  res.render("login");
}
async function register(req, res) {
  const { name, email, password } = req.body;

  const salt = 10;
  const hashedPass = await bcrypt.hash(password, salt);

  // query PR

  const dataUser = await userModel.create({
    name,
    email,
    password: hashedPass,
  });

  res.redirect("/login");
}
async function login(req, res) {
  const { email, password } = req.body;

  const dataUser = await userModel.findOne({
    where: { email },
  });

  if (!dataUser) {
    return console.error("Email not found!");
  }

  const passwordValid = await bcrypt.compare(password, dataUser.password);

  if (!passwordValid) {
    return console.error("Password is wrong!");
  }

  req.session.isLogin = true;
  req.session.dataUser = {
    name: dataUser.name,
    email: dataUser.email,
  };

  res.redirect("/");
}
async function logout(req, res) {
  req.session.destroy(function(err) {
    console.error("logout failed!");

    res.redirect("/login")
  })
}

async function home(req, res) {
  const query = "SELECT * FROM projects"; // menggunakan query
  const dataProject = await sequelize.query(query, { type: QueryTypes.SELECT });

  // const dataProject = await projectModel.findAll() // menggunakan ORM

  const isLogin = req.session.isLogin
  const dataUser = req.session.dataUser

  res.render("index", { dataProject, isLogin, dataUser }); // untuk menampilkan halaman home dan mengambil data
}
function project(req, res) {
  res.render("addProject");
}

async function addProject(req, res) {
  // membuat req body untuk menangkap data kemudian parse
  const { project, start, end, desc, tech } = req.body;

  let startDate = start.split("/");
  let endDate = end.split("/");

  let formatStartDate = startDate[2] + "-" + startDate[1] + "-" + startDate[0];
  let formatEndDate = endDate[2] + "-" + endDate[1] + "-" + endDate[0];

  let newStartDate = new Date(formatStartDate);
  let newEndDate = new Date(formatEndDate);

  let timeDifference = newEndDate - newStartDate;

  let differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let differenceInMonths = Math.floor(differenceInDays / 30.44);
  let differenceInYears = Math.floor(differenceInMonths / 12);

  let duration;

  if (differenceInYears > 0) {
    duration = `${differenceInYears} Years`;
  } else if (differenceInMonths > 0) {
    duration = `${differenceInMonths} Month`;
  } else {
    duration = `${differenceInDays} Days`;
  }

  // dataProject.unshift({
  //   project,
  //   start,
  //   end,
  //   duration,
  //   desc,
  //   tech,
  //   image:
  //     "https://images.pexels.com/photos/21624194/pexels-photo-21624194/free-photo-of-a-river-with-boats-and-buildings-in-the-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  // });

  const query = `INSERT INTO public.projects(
    image, project, start, "end", duration, "desc", tech, "createdAt", "updatedAt")
    VALUES ('https://images.pexels.com/photos/269630/pexels-photo-269630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', '${project}', '${start}', '${end}', '${duration}', '${desc}', '${tech}', 'now()', 'now()')`;

  const dataProject = await sequelize.query(query, { type: QueryTypes.INSERT });

  // const dataProject = await projectModel.create({
  //   image:
  //     "https://images.pexels.com/photos/269630/pexels-photo-269630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   project,
  //   start,
  //   end,
  //   duration,
  //   desc,
  //   tech,
  // });

  res.redirect("/");
}
async function deleteProject(req, res) {
  const { id } = req.params;
  // dataProject.splice(id, 1);

  const query = `DELETE FROM public.projects
  WHERE id=${id}`;
  const dataProject = await sequelize.query(query, { type: QueryTypes.DELETE });

  // const dataProject = await projectModel.destroy({
  //   where: { id },
  // });

  res.redirect("/");
}
async function editProject(req, res) {
  const { id } = req.params;
  // const selectedData = dataProject[id];
  // selectedData.id = id; // menambahkan object baru

  const dataProject = await projectModel.findOne({
    where: { id },
  });

  // res.render("editProject", { dataProject: selectedData });

  res.render("editProject", { dataProject });
}
async function submitEdit(req, res) {
  const { project, start, end, duration, desc, tech, id } = req.body; // mengambil data

  // dataProject[id] = {
  //   // mengganti dengan data baru
  //   project,
  //   start,
  //   end,
  //   duration,
  //   desc,
  //   tech,
  // };

  const query = `UPDATE public.projects
	SET project='${project}', start='${start}', "end"='${end}', duration='${duration}', "desc"='${desc}', tech='${tech}'
	WHERE id=${id}`;
  const dataProject = await sequelize.query(query, { type: QueryTypes.UPDATE });

  // const dataProject = await projectModel.update(
  //   {
  //     project,
  //     start,
  //     end,
  //     duration,
  //     desc,
  //     tech,
  //   },
  //   {
  //     where: {id}
  //   }
  // )

  res.redirect("/");
}

async function testimonials(req, res) {
  // const testimonial = [
  //   {
  //     image:
  //       "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     message:
  //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, nostrum.",
  //     author: "Rey Mysterio",
  //     rating: 3,
  //   },
  //   {
  //     image:
  //       "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     message:
  //       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, veritatis obcaecati.",
  //     author: "Brie Bella",
  //     rating: 5,
  //   },
  //   {
  //     image:
  //       "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum?",
  //     author: "Randy Orton",
  //     rating: 3,
  //   },
  //   {
  //     image:
  //       "https://images.pexels.com/photos/1182825/pexels-photo-1182825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     message:
  //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat natus adipisci laudantium? At, odit ducimus?",
  //     author: "Undertaker",
  //     rating: 2,
  //   },
  //   {
  //     image:
  //       "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     message:
  //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. veritatis obcaecati.",
  //     author: "Lita Company",
  //     rating: 4,
  //   },
  //   {
  //     image:
  //       "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //     message:
  //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. At, odit ducimus?",
  //     author: "Stephanie McMahon",
  //     rating: 4,
  //   },
  // ];

  const query = "SELECT * FROM testimonials";
  const testimonial = await sequelize.query(query, { type: QueryTypes.SELECT });

  res.render("testimonials", { testimonial: testimonial });
}
function contact(req, res) {
  res.render("contactForm");
}
async function projectPage(req, res) {
  const { id } = req.params;

  const query = `SELECT * FROM projects WHERE id=${id}`;
  const dataProject = await sequelize.query(query, { type: QueryTypes.SELECT });

  // const dataProject = await projectModel.findOne({
  //   where: { id },
  // });

  res.render("projectPage", { dataProject: dataProject[0] });

  // res.render("projectPage", { dataProject: dataProject });
}

app.listen(port, () => {
  console.log("server runing");
});
