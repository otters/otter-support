import { Message } from 'discord.js';
import { command, default as CookiecordClient, Module } from 'cookiecord';

export default class AdminSupportModule extends Module {
  constructor(client: CookiecordClient) {
    super(client);
  }

  @command()
  async forceclose(msg: Message) {
    const channels = msg.guild?.channels;

    if (!process.env.BOT_ADMINS) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Please add adminIDs first',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    const admins = process.env.BOT_ADMINS.split(',');

    if (!admins.includes(msg.author.id)) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'This command can only be executed by admins!',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    const supportCategory = channels?.cache.find(channel => channel.name === 'Support');

    if (!supportCategory) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Please make sure that the server has a Support category!',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    const supportChannel = channels?.cache.find(channel => channel.id === msg.channel.id);

    const regex = supportChannel?.name.match(/^support-.*-[0-9]{4}$/);

    if (!regex) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Execute this command inside a ticket!',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    if (!supportChannel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'You have no open ticket!',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    msg.channel.send({
      embed: {
        color: '#2ed573',
        title: 'Successfully closed the ticket!',
        timestamp: new Date(),
        footer: { text: '© Otters | Yet another sneaker dashboard.' },
      },
    });

    setTimeout(async () => {
      await supportChannel.delete('Support ticket closed by admin');
    }, 1000);
  }
}
