# LinkLoom

A web application to manage and organize bookmarks with collections and tags.

## Features

- User registration and authentication
- Create, edit, delete bookmarks
- Organize bookmarks into collections
- Tag bookmarks for easy filtering
- Responsive UI with EJS templates
- MongoDB for data persistence
- Session management and access control

## Deployment

This app is deployed on Render.com's free tier. You can visit it here: [LinkLoom](https://linkloom-60lb.onrender.com/).

### Environment Variables

| Key              | Description               |
| ---------------- | ------------------------- |
| `MONGODB_URI`    | MongoDB connection string |
| `SESSION_SECRET` | Secret key for sessions   |

Make sure these are set in your deployment environment.

---

## Local Setup

1. Clone repo:

   ```bash
   git clone https://github.com/yourusername/linkloom.git
   cd linkloom
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up `.env` file or environment variables for:

   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   USE_SESSION=true
   ```

4. Run app locally:

   ```bash
   npm start
   ```

---

## Basic Visualization

![[public/images/architecture-diagram.png]]

---

## Structure

```bash
.
├── app.js
├── bin
│   └── www
├── config
│   └── db.js
├── controllers
│   ├── bookmarkController.js
│   ├── collectionController.js
│   └── userController.js
├── .env
├── .gitignore
├── models
│   ├── bookmarkModel.js
│   ├── collectionModel.js
│   └── usersModel.js
├── package.json
├── package-lock.json
├── public
│   ├── javascripts
│   │   └── splash.js
│   └── stylesheets
│       └── style.css
├── README.md
├── routes
│   ├── bookmarks.js
│   ├── collections.js
│   ├── index.js
│   └── users.js
├── services
└── views
    ├── bookmarks
    │   ├── create.ejs
    │   ├── detail.ejs
    │   ├── edit.ejs
    │   └── list.ejs
    ├── collections
    │   ├── create.ejs
    │   ├── detail.ejs
    │   ├── edit.ejs
    │   └── list.ejs
    ├── error.ejs
    ├── index.ejs
    ├── layout.ejs
    ├── partials
    │   ├── footer.ejs
    │   └── header.ejs
    └── users
        ├── login.ejs
        ├── profile.ejs
        └── signup.ejs
```
