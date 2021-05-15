# **cs546-final-project: Video Game Review Platform**
Final Project for CS-546 Spring 2021 Group 37

## Setup
To run this project, you will need node.js, the package manager npm, and MongoDB.
1. Use ```npm install``` to install all node module dependencies.
3. Ensure that you have MongoDB running on your machine. Use ```npm run seed``` to populate the database with inital data.
    - ```npm run clear``` will clear the database.
4. Use ```npm start``` to start the server on ```localhost:3000```
5. Open ```localhost:3000``` in a web browser.
6. Now you are free to browse the site, sign-up, log-in, and view games and reviews!

# Seed Script
You can use the command ```npm run seed``` to populate the database with preset games, reviews and users.

There are 15 games created in the script which can be interacted with, along with reviews for several of the games.

Here is a list of the 5 preset Users:
1. User 1
    - Username: fborja44
    - Password: supersecret
2. User 2
    - Username: naomi
    - Password: password1
2. User 3
    - Username: brian
    - Password: password2
2. User 4
    - Username: bingxin
    - Password: password3
2. User 5
    - Username: BestProfessor
    - Password: cs546spring

## Project Description
This project will focus on making a web application where users will be able to share information about video games with other users. Users will be able to add video games that have not already been added to the site, write reviews on the game and also give the games a rating. Users will be able to discuss with other users over various aspects of the game such as its gameplay, pricing, upcoming updates, or other news. With these ratings and reviews, users will be able to search for games by rating, genre, and other categories in order to find games that they may be interested in, and see what other users are interested in as well.

## Core Features
Below are the core features that will be implemented as a part of the main project.

1. **Landing Page:** Homepage of the website with navigation bar to different sections of the website
    - Displays most popular/relevant games
2. **Game List Page:** List of games that have been reviewed. 
Game search can be filtered out by platform, genre and rating.
Information displayed in this list for each game will include the game title, platform, genre, overall user rating, price, release date, game studio and a brief description.
3. **User Profile:** Users can create an account where they can write reviews and add games to their lists that are already on the website. 
    - The account will show their profile, username, and reviews they have written
    - Additionally, lists of games they have liked or followed will be included
4. **Individual Game Page:** These pages will include the overall rating of the game and information about the game.
    - A list of user reviews
    - Aggregate/overall rating and number of likes
    - A like/follow/wishlist button
5. **Liking/Following/Wishlisting:** Users will be able to add games to different lists tied to their account:
    - “Liking” a game adds a game to their “Liked” list, and increases the number of likes for that game.
    - “Following” a game adds a game to their “Following” list and the user will get a notification whenever a user posts a review for that game
    - “Wishlisting” a game adds the game to their wishlist to notify other users that they are interested in and want to purchase that game
6. **Add New Game Page:** Users will be able to add new games to the website by inputting the information about the game such as the title, game cover, publisher, platform(s), and genre.
7. **Reviews:** Allow users to show their reviews about games.
    - Users can add, edit, or remove a review
    - Users will be able to reply to reviews
    - Users will be able to like or dislike other user game reviews

## Extra Features
Below are additonal features that are not a part of the core features of the project.

1. **Price Comparison:** Users will have the ability to compare the price of a specific game between platforms, and find sales through different distribution services (X-Box, Playstation, Steam, Epic Games, retail, etc.)
2. **Real Time Discounts:** Users will be able to check for discounted games on their wishlist/follow list.
    - Users who have a game wishlisted can also get a notification when their game goes on sale on a specific platform
3. **Private Messaging:** Users will be able to private message other users instead of on a public page.
4. **Report Users:** Users will be able to report misbehaving users/bot accounts/spam accounts.
5. **Marketplace:** Users can publish information to trade their old games and consoles 

## Github Repository
https://github.com/fborja44/cs546-final-project
