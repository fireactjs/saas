This project is built with [Firebase](https://firebase.google.com/) and [React](https://reactjs.org/). It is a fully functional web application that provides basic user sign in and user management features.

The project UI uses [CoreUI free template](https://coreui.io/react/).

## Live Demo

Visit [live demo](https://fireact-e1bdc.firebaseapp.com/).

You can sign in with email and password, Google or Facebook. Feel free to play around and test the demo site. You can delete your account when you are done with the demo.

## Purpose

The purpose of this project is to provide a starting point for building web applications that require user management functionalities, such as SaaS, membership websites, etc.

These basic user management functionalities are needed in many projects, and they are built over and over again. We hope that this project can reduce the time and efforts developers have to spend on building these functionalities, so that the developers can focus on the key features of their projects.

## Installation

### 1. Setup Firebase

This project uses Firebase to manage user accounts of the web application. You need to create a Firebase project first if you don't have a project yet.

### 2. Create Firebase Configuration File

Create a configuration file as `src/components/FirebaseAuth/firebase-config.json`.

To be able to communicate with your Firebase project, you will need to put the Firebase project settings to the configuration file. Copy the following JSON to the file, and replace the property values with your Firebase project settings.

To get your Firebase project settings, go to [Firebase console](https://console.firebase.google.com/), click on your project, and go to the project settings page. At the bottom of the page, add a web app and you will see the settings in a JSON called `firebaseConfig`.

```json
{
    "config":{
        "apiKey": "...",
        "authDomain": "...",
        "databaseURL": "...",
        "projectId": "...",
        "storageBucket": "...",
        "messagingSenderId": "...",
        "appId": "..."
    }
}
```

### 3. Enable Sign-in Methods

By default, the web application UI allows signing in with email address, Google account and Facebook account. You need to enable these sign-in methods in your Firebase project so that the sign-in functionality will work.

### 4. Setup Firebase Database Rules

This project stores user data in Firestore database. To secure the data so that only users with permission are able to access and interact with the data, copy and paste the database rules into your Firebase database rules.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /users/{userId} {
      allow read, update, create: if request.auth.uid == userId;
    }
    match /users/{userId}/activities/{documents=**} {
      allow read, create: if request.auth.uid == userId
    }
  }
}
```

### 5. Install Dependencies

In the project directory, run
```
npm install
```

### 6. Test Run

In the project directory, run
```
npm start
```

This will start up the web application in your browser. You can sign in and play around the project.

### 7. Build

In the project directory, run
```
npm run build
```

### 8. Deploy to Firebase

You will need to install Firebase tools and configure your Firebase project in your Firebase tools to deploy the project to your Firebase project hosting.

In the project directory, run
```
firebase deploy
```

## Development

Now, you have the basic user management functions in your web application. Modify `src/pages/auth/Home/index.js` to start building the features of your web application.

---

If you like this project, please click the star icon.

If you would like to see improvements on this project, please consider to be a contributor.

## Posts

I will post articles to explain how Fireact works. If you are interested in learning Fireact, or Firebase and React, please read the following articles.

- [Fireact — The open source project for you to fast track your next web app with Firebase and React](https://medium.com/@chaoming_li/fireact-the-open-source-project-for-you-to-fast-track-your-next-web-app-with-firebase-and-react-5ab98dcf9c93)

- [Fireact Part 1: Firebase authentication in React](https://medium.com/@chaoming_li/fireact-part-1-firebase-authentication-in-react-b835f6beacc5?source=friends_link&sk=26ed71ccd439fe97103416d7f4039cd7)