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

const flash = require("express-flash"); // untuk import membuat alert

const multer = require("multer"); // untuk import upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

const dataProject = []; // untuk menampung data ,jika sudah menggunakan database ini tidak digunakan

// configuration global
app.set("view engine", "hbs"); // memberitahukan view engine menggunakan hbs
app.set("views", path.join(__dirname, "./views")); // menghubungkan file hbs

// setting middleware untuk membuka folder lainnya
app.use("/assets", express.static(path.join(__dirname, "./assets"))); // membuka folder assets
app.use("/uploads", express.static(path.join(__dirname, "./uploads")))
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

app.use(flash()); // untuk menggunakan flash

// route
app.get("/", home); // untuk mengambil halaman home sebagai view
app.get("/project", project); // view
app.get("/editproject/:id", editProject); // view

app.post("/project", upload.single("image"), addProject); // service add project
app.post("/project/:id", deleteProject); // service delete project
app.post("/submitproject", submitEdit); // service edit project

app.get("/testimonials", testimonials); // view
app.get("/contactform", contact); // view
app.get("/projectpage/:id", projectPage); // view
app.get("/register", registerView); // view
app.get("/login", loginView); // view

app.post("/register", register); // service register
app.post("/login", login); // service login
app.post("/logout", logout); // service logout

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

  const query = `INSERT INTO public.users(
	name, email, password, "createdAt", "updatedAt")
	VALUES ('${name}', '${email}', '${hashedPass}', 'now()', 'now()')`;
  const dataUser = await sequelize.query(query, { type: QueryTypes.INSERT });

  // const dataUser = await userModel.create({
  //   name,
  //   email,
  //   password: hashedPass,
  // });

  res.redirect("/login");
}
async function login(req, res) {
  const { email, password } = req.body;

  const dataUser = await userModel.findOne({
    where: { email },
  });

  if (!dataUser) {
    req.flash("failed", "Login Failed!");
    return res.redirect("/login");
  }

  const passwordValid = await bcrypt.compare(password, dataUser.password);

  if (!passwordValid) {
    req.flash("failed", "Login Failed!");
    return res.redirect("/login");
  }

  req.session.isLogin = true;
  req.session.dataUser = {
    id: dataUser.id,
    name: dataUser.name,
    email: dataUser.email,
  };

  req.flash("success", "Login Success!");

  res.redirect("/");
}
async function logout(req, res) {
  req.session.destroy(function (err) {
    console.error("logout failed!");

    res.redirect("/login");
  });
}

async function home(req, res) {
  const query = `SELECT * FROM public.users JOIN public.projects ON public.users.id = public.projects."userId"`; // menggunakan query
  const dataProject = await sequelize.query(query, { type: QueryTypes.SELECT });

  // const dataProject = await projectModel.findAll() // menggunakan ORM

  const isLogin = req.session.isLogin;
  const dataUser = req.session.dataUser;

  res.render("index", { dataProject, isLogin, dataUser }); // untuk menampilkan halaman home dan mengambil data
}
function project(req, res) {
  const isLogin = req.session.isLogin;
  const dataUser = req.session.dataUser;

  res.render("addProject", { isLogin, dataUser });
}

async function addProject(req, res) {
  // membuat req body untuk menangkap data kemudian parse
  const { project, start, end, desc, tech1, tech2, tech3, tech4 } = req.body;

  const image = req.file.path;

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

  const dataUserId = req.session.dataUser.id;

  const query = `INSERT INTO public.projects(
    image, project, start, "end", duration, "desc", tech1, tech2, tech3, tech4, "createdAt", "updatedAt", "userId")
    VALUES ('${image}', '${project}', '${start}', '${end}', '${duration}', '${desc}', '${tech1}', '${tech2}', '${tech3}', '${tech4}', 'now()', 'now()', ${dataUserId})`;
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

  console.log(dataProject);

  res.redirect("/");
}
async function deleteProject(req, res) {
  const { id } = req.params;

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

  const isLogin = req.session.isLogin;
  const dataUser = req.session.dataUser;

  // res.render("editProject", { dataProject: selectedData });

  res.render("editProject", { dataProject, isLogin, dataUser });
}
async function submitEdit(req, res) {
  const { project, start, end, desc, tech1, tech2, tech3, tech4, id } =
    req.body; // mengambil data

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
	SET project='${project}', start='${start}', "end"='${end}', "desc"='${desc}', duration='${duration}', tech1='${tech1}', tech2='${tech2}', tech3='${tech3}', tech4='${tech4}'
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
  const query = "SELECT * FROM testimonials";
  const testimonial = await sequelize.query(query, { type: QueryTypes.SELECT });

  const isLogin = req.session.isLogin;
  const dataUser = req.session.dataUser;

  res.render("testimonials", { testimonial: testimonial, isLogin, dataUser });
}
function contact(req, res) {
  const isLogin = req.session.isLogin;
  const dataUser = req.session.dataUser;

  res.render("contactForm", { isLogin, dataUser });
}
async function projectPage(req, res) {
  const { id } = req.params;

  const query = `SELECT * FROM projects WHERE id=${id}`;
  const dataProject = await sequelize.query(query, { type: QueryTypes.SELECT });

  // const dataProject = await projectModel.findOne({
  //   where: { id },
  // });

  const isLogin = req.session.isLogin;
  const dataUser = req.session.dataUser;

  res.render("projectPage", { dataProject: dataProject[0], isLogin, dataUser });

  // res.render("projectPage", { dataProject: dataProject });
}

app.listen(port, () => {
  console.log("server runing");
});
