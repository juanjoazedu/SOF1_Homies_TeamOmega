# Homies

A web application built with React, TypeScript, and Vite that clones the core experience of X (formerly Twitter). Users can register, log in, publish tweets, follow other users, and read a feed with the tweets of the people they follow. This first milestone works with mocked data; the backend will be migrated to Firebase in the next milestone.

## Members
- Juan Jose Avendaño Zapata
- Samuel Stevan Arias Tuquerres

## Features
- **User Registration:** Form with full name, username, email, password, and date of birth. Validates that neither the username nor the email is already in use, and signs the user in automatically after creating the account.
- **Login:** Sign in with username and password. Includes a "Continue with Google" option that will be enabled once Firebase Authentication is connected.
- **Conditional Routing:** `AppRouter` renders public routes (`/login`, `/register`) or private routes depending on `authState.status`, so login and logout redirect automatically.
- **Feed:** Tweets from the session user and the people they follow, sorted from newest to oldest, with **For you** and **Following** tabs.
- **Publish Tweets:** Multiline form with a live character counter. Tweets cannot be empty or exceed 280 characters, and the user is notified when the tweet is published.
- **Tweet Detail:** Dedicated view for each tweet at `/u/:username/tweet/:tweetId`, with like and retweet actions.
- **User Profile:** Full name, username, bio, date of birth, join date, follower and following counters, and the user's tweets.
- **Followers and Following:** Lists sorted alphabetically by full name, with follow and unfollow buttons. The session user's own card never shows a follow button.
- **Pagination:** Every list (feed, profile tweets, followers, following) shows at most 10 items per page through the reusable `usePagination` hook.
- **Navigation:** Reusable `PageHeader` with a back arrow and title, and a layout that keeps every page in the same centered column.

## Tech Stack
- **Frontend Framework:** React + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **Styles:** Native CSS with CSS variables
- **Linting:** ESLint
- **Package Manager:** Yarn

## Prerequisites
- Node.js v20.x.x LTS
- Yarn (v1 Classic)

If you don't have Yarn installed:
```bash
npm install -g yarn
```

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
3. **Run the project in development mode:**
   ```bash
   yarn dev
   ```
   Then open the local URL shown in the terminal (usually `http://localhost:5173`).