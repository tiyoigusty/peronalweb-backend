// var dataProject = [];

function addProject(e) {
  e.preventDefault();

  let project = document.getElementById("projectName").value;
  let start = document.getElementById("start").value;
  let end = document.getElementById("end").value;
  let description = document.getElementById("description").value;
  let tech = document.querySelectorAll("input:checked");
  // let image = document.getElementById("uploadImg").value;
  let image = document.getElementById("uploadImg").files[0];

  if (project === "") {
    return alert("Please entered your Project Name!");
  } else if (start === "") {
    return alert("Please entered your Start Date!");
  } else if (end === "") {
    return alert("Please entered your End Date!");
  } else if (description === "") {
    return alert("Please entered your Description!");
  } else if (tech.length === 0) {
    return alert("Please choose your Technologies!");
  } else if (!image) {
    return alert("Please entered your Image!");
  }

  let imageURL = URL.createObjectURL(image);

  var listTech = [];

  tech.forEach((item) => {
    listTech.push(item.value);
  });

  // membuat tanggal tidak dapat disubmit jika lebih awal
  if (end < start) {
    return alert("End date can't be less than start date");
  }

  // merubah format tanggal
  // let startDate = start.split("/");
  // let endDate = end.split("/");

  // let formatStartDate = startDate[2] + "-" + startDate[1] + "-" + startDate[0];
  // let formatEndDate = endDate[2] + "-" + endDate[1] + "-" + endDate[0];

  // let newStartDate = new Date(formatStartDate);
  // let newEndDate = new Date(formatEndDate);

  // // menghitung perbedaan waktu
  // let timeDifference = newEndDate - newStartDate;

  // let differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  // let differenceInMonths = Math.floor(differenceInDays / 30.44);
  // let differenceInYears = Math.floor(differenceInMonths / 12);

  // // menghitung durasi
  // let duration;

  // if (differenceInYears > 0) {
  //   duration = `${differenceInYears} years`;
  // } else if (differenceInMonths > 0) {
  //   duration = `${differenceInMonths} month`;
  // } else {
  //   duration = `${differenceInDays} days`;
  // }

  // dataProject.unshift({
  //   project: project,
  //   start: start,
  //   end: end,
  //   description: description,
  //   technologies: listTech,
  //   image: imageURL,
  //   duration: duration,
  // });

  // console.log(dataProject);

  // newProject();
}

// function newProject() {
//   document.getElementById("row").innerHTML = "";

//   for (let i = 0; i < dataProject.length; i++) {
//     const projectPlus = dataProject[i];

//     document.getElementById("row").innerHTML += `
//     <div class="row" id="row">
//       <div class="list">
//         <img src="${projectPlus.image}" alt="project" />
//         <a href="projectPage.html"><h3 class="projectName">${projectPlus.project}</h3></a>
//         <p class="date">Start : ${projectPlus.start} | End : ${projectPlus.end}<br> Duration : ${projectPlus.duration}</p>
//         <p class="desc">${projectPlus.description}</p>
//         <p class="icons">
//           <i class='bx bxl-play-store'></i>
//           <i class='bx bxl-android'></i>
//           <i class='bx bxl-java'></i>
//         </p>

//         <div class="btn">
//           <button type="button">Edit</button>
//           <button type="button">Delete</button>
//         </div>
//       </div>
//     </div>
//     `;
//   }
// }
