// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyBLZ48lDMSumdQ_8ZsYkA7QU-j7tJAdKOE",
  authDomain: "nwa-bbgdc.firebaseapp.com",
  databaseURL:
    "https://nwa-bbgdc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nwa-bbgdc",
  storageBucket: "nwa-bbgdc.appspot.com",
  messagingSenderId: "383514622189",
  appId: "1:383514622189:web:87895609b2daa6804574e4",
  measurementId: "G-45VL8C73S7",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
