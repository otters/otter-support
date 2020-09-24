import CookiecordClient, { HelpModule } from 'cookiecord';
import dotenv from 'dotenv-safe';
import TicketModule from './modules/TicketModule';

// Load the variables from .env
dotenv.config();

// Create a new Cookiecord client 🍪
const client = new CookiecordClient({
  botAdmins: process.env.BOT_ADMINS?.split(','),
  prefix: '!',
});

// If the bot is running in production, load every module seperate 🛠
if (process.env.NODE_ENV === 'production') {
  client.registerModule(TicketModule);
} else {
  client.loadModulesFromFolder('src/modules');
  client.reloadModulesFromFolder('src/modules');
}

client.registerModule(HelpModule);

client.login(process.env.TOKEN);

// We are ready to rumble! 🥊
client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`));
