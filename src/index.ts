import CookiecordClient from 'cookiecord';
import dotenv from 'dotenv-safe';
import OpenSupportModule from './modules/OpenSupportModule';
import CloseSupportModule from './modules/CloseSupportModule';
import AdminSupportModule from './modules/AdminSupportModule';

// Load the variables from .env
dotenv.config();

// Create a new Cookiecord client 🍪
const client = new CookiecordClient({
  botAdmins: process.env.BOT_ADMINS?.split(','),
  prefix: '!',
});

// If the bot is running in production, load every module seperate 🛠
if (process.env.NODE_ENV === 'production') {
  client.registerModule(OpenSupportModule);
  client.registerModule(CloseSupportModule);
  client.registerModule(AdminSupportModule);
} else {
  client.loadModulesFromFolder('src/modules');
  client.reloadModulesFromFolder('src/modules');
}

client.login(process.env.TOKEN);

// We are ready to rumble! 🥊
client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`));
