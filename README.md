# Real-Time Web @cmda-minor-web · 2019-2020
Repository for the Real-Time-Web course.
[DEMO](https://mysterious-harbor-42719.herokuapp.com/)

## Table of contents
* [Description](#description)
* [Concept](#concept)
* [Diagram](#diagram)
* [Prerequisites](#prerequisites)
* [Installing](#installing)

# Description
This application tries to bring people together online to listen to their favorite music genre's.

# Concept
The application is build with the use of sockets, this enables us to create the possibility of communication between users in real time.
Sockets are used to create rooms which people can join and listen to the same music together. The rooms are created with a Spotify playlist
linked to the room so the users in the same room have the same music in front of them. From this playlist the users can add songs to their
playback que and others get notified that a song is added to the que.

<details>
<summary>Concept images</summary>
Home page after logging into Spotify.
<img src="./github/images/home.png" alt="Home page after loging in to spotify">

Creating room page, list of playlists of the user.
<img src="./github/images/create-party.png" alt="Creating a party room out of your playlists">

Party room after creation with songs and que.
<img src="./github/images/party-room.png" alt="Party room created with playlist">
</details>

# Diagram
<img src="./static/images/github/diagram.png" alt="">

## Prerequisites
* Nodejs
* NPM

## Installing

Clone repository to your local directory
```
git clone https://github.com/damian1997/real-time-web-1920.git
```

Installing dependencies
```
npm install
```

Bundle core assets and watch files
```
npm run bundle
```

Run server localy
```
npm run dev
```
