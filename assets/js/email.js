
  document.getElementById("myform").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    // Initialize Email.js with the provided public key
    emailjs.init("B-gtRKoQjyArLOcNU");

    // Get form values
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value;

    // Validate input fields
    if (!name || !phone || !email || !subject || !message) {
      document.getElementById("error_message").innerText = "Please fill in all fields!";
      return;
    } else {
      document.getElementById("error_message").innerText = "";
    }

    // Send email using Email.js
    emailjs.send("service_ngajf4o", "template_yb5ve94", {
      from_name: name,
      phone: phone,
      email: email,
      subject: subject,
      message: message
    })
    .then(function(response) {
      alert("Message sent successfully!");
      document.getElementById("myform").reset(); // Reset form on success
    }, function(error) {
      alert("Message sending failed. Please try again.");
    });
  });

