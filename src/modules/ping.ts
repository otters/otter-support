import { Message } from 'discord.js';
import { command, default as CookiecordClient, Module } from 'cookiecord';

export default class PingModule extends Module {
  constructor(client: CookiecordClient) {
    super(client);
  }

  @command()
  ping(msg: Message) {
    msg.reply('Otter-support ready!');
  }
}
