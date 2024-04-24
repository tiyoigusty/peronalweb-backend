// --------------- CONTACT ME ---------------------

// membuat function
function submitEmail() {
  // memanggil element
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let subject = document.getElementById("subject").value;
  let message = document.getElementById("message").value;

  // pengkondisian
  if (name == "") {
    return alert("Please entered your name!");
  } else if (email == "") {
    return alert("Please entered your e-mail!");
  } else if (phone == "") {
    return alert("Please entered your phone number!");
  } else if (subject == "") {
    return alert("Please entered your subject!");
  } else if (message == "") {
    return alert("Please entered your message!");
  }

  const data = {
    name,
    email,
    phone,
    subject,
    message,
  };
  const myEmail = "tiyooigustyy@gmail.com";

  let a = document.createElement("a");
  a.href = `https://mail.google.com/mail?view=cm&fs=1&form=&to=${myEmail}&su=${subject}&body=${message}`;
  a.click();

  console.log(data);
}
