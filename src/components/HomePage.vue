<script setup>
import AOS from "aos";
import { onMounted, reactive } from "vue";
import { Auth } from '@/firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from '@/firebase/app';


const initialValues = reactive({
      title: 'Travel Treasury',
      email: '',
      message: '',
      contact_email: '',
      contact_message: '',
      contact_error: '',
      show_contact: true
})
    // Add email func
    async function addEmail(email) {
      let noticeMessage = 'You have been added in our wishlist 🏅'
      await createUserWithEmailAndPassword(Auth, email, randomPassword(25)).catch(function (error) {
        if (error.code == 'auth/email-already-in-use') {
          noticeMessage = 'Email already in use'
        }
      })
      initialValues.message = noticeMessage
      initialValues.email = ''
    }

    // Generate random password values
    function randomPassword(length) {
    let chars = "alksnfwiurg#^@&!(#@!T&@824ry192817griu@!**(!Hwjverwerkwnrweprw@!(*!&@^!Gb43363232f)))";
    let password = "";
    for(let char = 0; char < chars.length; char++) {
      let i = Math.floor(Math.random() * length)
      password += chars.charAt(i);
    }
    return password;
    }

    // Send contact details to firebase database
    async function sendContactForm() {
     if(initialValues.contact_email === '') {
      initialValues.contact_error = "The email field cannot be empty";
      return;
     } else if(initialValues.contact_message === '') {
      initialValues.contact_error = "The message field cannot be empty";
      return;
     }
     await addDoc(collection(db, "contacts"), {
            contact_email: initialValues.contact_email,
            contact_message: initialValues.contact_message,
            createdAt: serverTimestamp()
          });
          initialValues.contact_error = false;
          initialValues.contact_email = "";
          initialValues.contact_message = "";
    }

  onMounted(() => {
    AOS.init();
})
</script>

<template>
  <div class="container-fluid m-0 p-0">
    <div id="home" class="full-height p-4">
      <div class="container">
        <div class="row pb-5">
          <div class="col-lg-6 pt-4 my-auto text-center"
           data-aos="slide-left"
           data-aos-offset="250"
          data-aos-easing="ease-in-out"
          >
            <div class="text-center mb-3 d-block d-lg-none">
              <h1 class="display-3">{{ initialValues.title }}</h1>
              <h3>Find the World</h3>
            </div>
            <img  data-aos="fade-up"  id="phone-img" src="../assets/travelTreasuryiPhone.png" class="img-fluid" />
          </div>

          <div class="col-lg-6 my-auto pt-4">
            <div class="text-center mb-3 d-none d-lg-block">
              <h1 class="display-3">{{ initialValues.title }}</h1>
              <h3>Find the World</h3>
            </div>

            <div class="border p-3 p-mb-5 bg-white rounded shadow">
              <h2 class="text-center">Coming Soon</h2>
              <form @submit.prevent="addEmail(email)">
                <div class="form-group text-center">
                  <label>
                    Reserve your account now. We will contact when our app goes live.
                    <input
                      v-model="email"
                      class="form-control"
                      type="email"
                      placeholder="Enter your email"
                    />
                    <small id="emailHelp" class="form-text text-muted"
                      >We will never share your email address</small
                    >
                  </label>

                  <button type="submit" class="btn btn-success mt-3">Join waiting list</button>
                  <div class="mt-4 text-center">
                    <h5 class="m-0 p-0">{{ initialValues.message }}</h5>
                  </div>
                </div>
              </form>
            </div>

            <div id="available" class="p-2">
              <h4 class="text-center mb-2 mt-3 text-light">Available On</h4>

              <div class="row text-center">
                <div class="col my-auto">
                  <img
                    src="../assets/download_apple.png"
                    class="float-right img-filled app_img"
                    alt=""
                  />
                </div>
                <div class="col my-auto">
                  <img
                    src="../assets/download_google.png"
                    class="float-left img-filled app_img"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="about" class="bg-light p-3 p-md-6">
      <div class="row">
        <div class="col-lg text-center ">
          <img src="../components/icons/app.svg" height="150" class="m-4 img" alt="" />
          <h5 class="ml-md-4 mr-md-4 fs-5">
            Plan your next adventure by setting a daily spending budget. We make it easy to break
            your expenses down by category, giving you more item to the important things!
          </h5>
        </div>

        <div class="col-lg text-center">
          <img src="../components/icons/piggy-bank.svg" height="120" class="m-4 img" alt="" />
          <h5 class="ml-md-4 mr-md-4 fs-5">
            Plan your next adventure by setting a daily spending budget. We make it easy to break
            your expenses down by category, giving you more item to the important things!
          </h5>
        </div>

        <div class="col-lg text-center fs-5">
          <img src="../components/icons/passport.svg" height="120" class="m-4 img" alt="" />
          <h5 class="ml-md-4 mr-md-4">
            Plan your next adventure by setting a daily spending budget. We make it easy to break
            your expenses down by category, giving you more item to the important things!
          </h5>
        </div>
      </div>
    </div>

    <div id="contact" class="p-4">
      <div class="row justify-content-center mt-3 mb-3">

        <div v-if="initialValues.show_contact == true" class="col-lg-4">
          <h2 class="text-center">Have Any Questions?</h2>
          <p class="text-center">Wanna get in touch? Fill the form below. Thanks!</p>


          <div v-if="initialValues.contact_error != ''" class="alert alert-warning text-center">
            There was a problem submitting your message <br /> {{ initialValues.contact_error }}
          </div>

          <form @submit.prevent="sendContactForm()">
            <div class="form-group text-left">
              <input v-model="contact_email" type="email" placeholder="Enter Your Email" class="form-control" />

              <textarea v-model="contact_message" class="form-control mt-3" placeholder="Enter Your Message" row="5" />
            </div>

            <div class="mx-auto text-center mt-3">
              <button type="submit" class="btn btn-primary">Send Message</button>
            </div>
          </form>
        </div>

        <div v-else class="text-center">
          <h2>Message sent successfully</h2>
          <p>Thank you for contacting us, we will get back to you as soon as we can.</p>
        </div>
        
      </div>
    </div>

    <div id="footer" class="p-4">
      <footer class="text-light p-4 text-center">
        <a href="/privacy" class="text-warning">Privacy Policy</a>
        <br />
        <small>&copy; Travel Treasury</small>
      </footer>
    </div>
  </div>
</template>

<style scoped>
#home {
  background-color: #92d2f2;
  background: url('../assets/bg.jpg') no-repeat center center;
  --webkit-background-size: cover;
  --moz-background-size: cover;
  --o-background-size: cover;
  background-size: cover;
}
#about {
  min-height: 40vh;
}
.img {
  height: 150px;
  width: auto
}
#phone-img {
  max-height: 80vh;
}
.app_img {
  max-height: 80px;
}
#contact {
  background-color: #57aeaf;
}
#footer {
  background-color: #000000;
}
</style>
