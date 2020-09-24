import { Message } from 'discord.js';
import { command, default as CookiecordClient, Module } from 'cookiecord';

export default class CloseSupportModule extends Module {
  constructor(client: CookiecordClient) {
    super(client);
  }

  @command()
  async close(msg: Message) {
    const channels = msg.guild?.channels;

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

    const supportChannel = channels?.cache.find(
      channel => channel.name === `support-${msg.author.username}-${msg.author.discriminator}`.toLowerCase(),
    );

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

    const regex = supportChannel?.name.match(/^support-.*-[0-9]{4}$/);

    if (!regex) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Execute this command inside your ticket!',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    msg.channel.send({
      embed: {
        color: '#2ed573',
        title: 'Successfully closed your ticket!',
        timestamp: new Date(),
        footer: { text: '© Otters | Yet another sneaker dashboard.' },
      },
    });

    setTimeout(async () => {
      await supportChannel.delete('Support ticket closed');
    }, 1000);
  }
}
