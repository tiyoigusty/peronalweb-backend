// ----------------- OOP CONCEPT -------------------

// class Testimonial {
//   image = "";
//   message = "";
//   author = "";

//   constructor(image, message, author) {
//     this.image = image;
//     this.message = message;
//     this.author = author;
//   }

//   html() {
//     return `<div class="testimonial">
//         <img src="${this.image}" alt="picture" />
//         <p class="message">${this.message}</p>
//         <p class="author"><b>${this.author}</b></p>
//     </div>`;
//   }
// }

// const testimoni1 = new Testimonial(
//   "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//   "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore, nostrum.",
//   "Rey Mysterio"
// );
// const testimoni2 = new Testimonial(
//   "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//   "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, veritatis obcaecati.",
//   "Brie Bella"
// );
// const testimoni3 = new Testimonial(
//   "https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum?",
//   "Randy Orton"
// );

// const testimonials = [testimoni1, testimoni2, testimoni3]; // array of object

// let testimonialHTML = ``;

// for (let i = 0; i < testimonials.length; i++) {
//   testimonialHTML += testimonials[i].html();
// }

// document.getElementById("row").innerHTML = testimonialHTML;

// -------------------- HOF ---------------------------------

// const testimonials = [
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
//     message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
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

// function allTestimonial() {
//   if (!testimonials.length) {
//     return (document.getElementById(
//       "row"
//     ).innerHTML = `<h1 class="not-found">Data not found!</h1>`);
//   }

//   const testimonialHTML = testimonials.map((testimonial) => {
//     return `
//       <div class="testimonial">
//         <img src="${testimonial.image}" alt="picture" />
//         <p class="message">${testimonial.message}</p>
//         <p class="author"><b>- ${testimonial.author}</b></p>
//         <p class="rating"><b>${testimonial.rating} <i class="bx bxs-star"></i></b></p>
//       </div>`;
//   });

//   document.getElementById("row").innerHTML = testimonialHTML.join("");
// }

// function rateTestimonial(rating) {
//   const ratedTestimonial = testimonials.filter(
//     (testimonial) => testimonial.rating == rating
//   );

//   if (!ratedTestimonial.length) {
//     return (document.getElementById(
//       "row"
//     ).innerHTML = `<h1 class="not-found">Data not found!</h1>`);
//   }

//   const testimonialHTML = ratedTestimonial.map((testimonial) => {
//     return `
//     <div class="testimonial">
//       <img src="${testimonial.image}" alt="picture" />
//       <p class="message">${testimonial.message}</p>
//       <p class="author"><b>- ${testimonial.author}</b></p>
//       <p class="rating"><b>${testimonial.rating} <i class="bx bxs-star"></i></b></p>
//     </div>`;
//   });

//   document.getElementById("row").innerHTML = testimonialHTML.join("");
// }

// ------------------------ AJAX -----------------------------

function getDatas(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onload = () => {
      resolve(JSON.parse(xhr.response));
    };

    xhr.onerror = () => {
      reject("Network Error!");
    };

    xhr.send();
  });
}

async function allTestimonial() {
  const testimonials = await getDatas(
    "https://api.npoint.io/3a18d33d1c98bbe9e298"
  );

  if (!testimonials.length) {
    return (document.getElementById(
      "row"
    ).innerHTML = `<h1 class="not-found">Data not found!</h1>`);
  }

  const testimonialHTML = testimonials.map((testimonial) => {
    return `
        <div class="testimonial">
          <img src="${testimonial.image}" alt="picture" />
          <p class="message">${testimonial.message}</p>
          <p class="author"><b>- ${testimonial.author}</b></p>
          <p class="rating"><b>${testimonial.rating} <i class="bx bxs-star"></i></b></p>
        </div>`;
  });

  document.getElementById("row").innerHTML = testimonialHTML.join("");
}

async function rateTestimonial(rating) {
  const testimonials = await getDatas(
    "https://api.npoint.io/3a18d33d1c98bbe9e298"
  );

  const ratedTestimonial = testimonials.filter(
    (testimonial) => testimonial.rating == rating
  );

  if (!ratedTestimonial.length) {
    return (document.getElementById(
      "row"
    ).innerHTML = `<h1 class="not-found">Data not found!</h1>`);
  }

  const testimonialHTML = ratedTestimonial.map((testimonial) => {
    return `
      <div class="testimonial">
        <img src="${testimonial.image}" alt="picture" />
        <p class="message">${testimonial.message}</p>
        <p class="author"><b>- ${testimonial.author}</b></p>
        <p class="rating"><b>${testimonial.rating} <i class="bx bxs-star"></i></b></p>
      </div>`;
  });

  document.getElementById("row").innerHTML = testimonialHTML.join("");
}

allTestimonial();
