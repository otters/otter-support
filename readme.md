![Otters logo](./docs/otters.jpg)

## Developer guide
#### 🛠 Installation
- Clone everything down from the repository
- Install dependencies with `yarn`
- Set up your .env according to .env.example
```.dotenv
TOKEN=DISCORD_BOT_TOKEN
BOT_ADMINS=DISCORD_ADMIN_ID
NODE_ENV=development/production
```
- Run the code with `yarn start`

####  🛠 Setup in Discord
Now you are ready to do the setup in Discord, great job! 🥳

There are many optional features and settings but only **the one is required**
- **Required** 
    - Create a category named "Support", if you want to run the default code then it is important that the name starts with a capital S. 
- **Optional**
    - Create a role for you support team and set up permissions so only they can see tickets, users already get access when opening a ticket.
    - Only give the bot read and write permissions in the Support category. That way your main chat doesn't get flooded with bot messages 😅


