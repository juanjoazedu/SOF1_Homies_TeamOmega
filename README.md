# Homies

A Single Page Application built with React, TypeScript, and Vite that clones the core experience of X (formerly Twitter). Users can register, log in, publish tweets with photos and videos, follow other users, and read a feed with the tweets of the people they follow. The backend runs on Firebase: **Authentication** for accounts, **Cloud Firestore** for data, and **Cloud Storage** for images and videos. Every list updates in real time through Firestore listeners.

## Members
- Juan Jose Avendaño Zapata
- Samuel Stevan Arias Tuquerres

## Features
- **User Registration:** Form with full name, username, email, password, date of birth, and an optional profile photo. Validates that neither the username nor the email is already in use and signs the user in automatically after creating the account.
- **Login:** Sign in with username and password, or with a Google account. The session is kept after reloading the page.
- **Conditional Routing:** `AppRouter` renders public routes (`/login`, `/register`) or private routes depending on the session, so login and logout redirect automatically.
- **Feed:** **For you** tab with the latest tweets of the platform and **Following** tab with the tweets of the session user and the people they follow, sorted from newest to oldest. Retweets are shown with the name of the user who reposted them.
- **Publish Tweets:** Modal with a multiline text field, a live character counter, and up to 4 photos or videos per tweet. Tweets cannot exceed 280 characters, and the user is notified when the tweet is published.
- **Edit and Delete Tweets:** The author can edit the text and the media of a tweet, or delete it after a confirmation. Deleted media is also removed from Cloud Storage.
- **Likes and Retweets:** Counters updated with Firestore transactions.
- **Tweet Detail:** Dedicated view for each tweet at `/u/:username/tweet/:tweetId`.
- **User Profile:** Profile photo, full name, username, bio, date of birth, join date, follower and following counters, a follow button, and the user's tweets.
- **Followers and Following:** Lists sorted alphabetically by full name, with follow and unfollow buttons. The session user's own card never shows a follow button.
- **User Search:** Right sidebar, always visible, that lists every user of the app with a follow button. It searches by username after the user stops typing and shows 6 users per page.
- **Pagination:** The feed, profile tweets, followers, and following lists show at most 10 items per page through the reusable `usePagination` hook.
- **Common Header:** Logo that goes back to the home page, navigation links, a **Post** button, the name and username of the session user, and a logout option with confirmation.

Every tweet is displayed with the format required by the course:

```
Full name, @username - Publication date and time
Message body
```

## Tech Stack
- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Authentication:** Firebase Authentication (email/password and Google)
- **Database:** Cloud Firestore
- **File Storage:** Cloud Storage for Firebase
- **Styles:** Native CSS with CSS variables
- **Code Style:** Airbnb JavaScript Style Guide
- **Package Manager:** Yarn

## Project Structure
The code is organized by feature:

```
src/
├── assets/    # SVG icons and logo
├── auth/      # Login, registration, session context, reducer and auth service
├── tweets/    # Feed, tweet card, tweet form and modal, tweet detail, tweet service
├── users/     # Profile, follow lists, user search, follow button, user service
├── routes/    # AppRouter
├── shared/    # Firebase config and storage service, reusable hooks, utilities and global CSS
└── ui/        # Shared components (Header, Layout, Modal, Toast, Pagination, PageHeader)
```

Each feature follows the same layers: `types`, `services`, `contexts`, `hooks`, `components`, and `pages`.

### Firestore collections
| Collection | Content |
| :--- | :--- |
| `users` | Profile of each user (`users/{uid}`) |
| `usernames` | Reserved usernames used to log in with username (`usernames/{username}`) |
| `follows` | Follow relationships (`follows/{followerUid}_{followingUid}`) |
| `tweets` | Tweets with text, media, and counters |
| `tweetInteractions` | Likes and retweets (`tweetInteractions/{uid}_{tweetId}_{type}`) |

### Cloud Storage folders
| Folder | Content |
| :--- | :--- |
| `avatars/{uid}` | Profile photos uploaded during registration |
| `tweets/{uid}/` | Photos and videos attached to tweets |

## Prerequisites
- Node.js 20.19+ or 22.12+ (required by Vite)
- Yarn (v1 Classic)
- A Firebase project

If you don't have Yarn installed:
```bash
npm install -g yarn
```

## Firebase Setup
1. **Create a project** in the [Firebase console](https://console.firebase.google.com/) and register a **Web app** to get its configuration.
2. **Authentication:** go to *Authentication → Sign-in method* and enable **Email/Password** and **Google**. In *Settings → Authorized domains*, make sure `localhost` and `127.0.0.1` are listed.
3. **Cloud Firestore:** go to *Firestore Database → Create database* and start it in **test mode**.
4. **Cloud Storage:** go to *Storage → Get started* and start it in **test mode**. Cloud Storage requires the project to be on the **Blaze** (pay-as-you-go) plan; it keeps a no-cost usage tier, which is enough for this project.
5. **Environment variables:** copy `.env.example` to `.env` and fill it with the values of your Web app (*Project settings → General → Your apps*):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
   The `.env` file is ignored by Git and must never be committed.

> Test mode rules expire after 30 days. If reads or writes start failing with permission errors, extend the date in the Firestore and Storage rules from the Firebase console.

## Instructions for Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/juanjoazedu/SOF1_Homies_TeamOmega.git
   cd SOF1_Homies_TeamOmega
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Configure Firebase** following the steps in [Firebase Setup](#firebase-setup).
4. **Run the project in development mode:**
   ```bash
   yarn dev
   ```
   Then open the local URL shown in the terminal (usually `http://localhost:5173`) and create an account from the registration page.

## Available Scripts
- `yarn dev`: starts the development server.
- `yarn build`: type-checks the project and builds it for production.
- `yarn preview`: serves the production build locally.
- `yarn lint`: runs ESLint.

## Git Workflow
- `main`: stable version for each delivery.
- `develop`: integration branch.
- `feature/*` and `fix/*`: one branch per feature or bug fix, merged into `develop` through pull requests with code review.

## AI Usage
The team used AI assistants during development. The conversation log (prompts, summarized answers, and files created or modified) is kept in [`IAStatement.md`](./IAStatement.md) at the root of the repository, as required by the course.

## License
This project was developed for academic purposes as part of the Software 1 course.