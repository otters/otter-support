import { Message } from 'discord.js';
import { command, default as CookiecordClient, Module } from 'cookiecord';

export default class OpenSupportModule extends Module {
  constructor(client: CookiecordClient) {
    super(client);
  }

  @command()
  async open(msg: Message) {
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

    if (supportChannel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'You already have an open ticket!',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    const channel = await msg.guild?.channels.create(
      `support-${msg.author.username}-${msg.author.discriminator}`.toLowerCase(),
      {
        type: 'text',
        parent: supportCategory.id,
        topic: `Support ticket for ${msg.author.username} | ${new Date().toJSON().substring(0, 10).replace('T', ' ')}`,
      },
    );

    if (!channel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Something went wrong, try again please',
          timestamp: new Date(),
          footer: { text: '© Otters | Yet another sneaker dashboard.' },
        },
      });
    }

    await channel.updateOverwrite(msg.author.id, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      READ_MESSAGE_HISTORY: true,
    });

    await msg.react('✅');

    return channel.send({
      embed: {
        color: '#2ed573',
        title: 'Ticket successfully created!',
        description: 'Ask your question and a staff member will soon be here to help you!',
        timestamp: new Date(),
        footer: { text: '© Otters | Yet another sneaker dashboard.' },
      },
    });
  }
}
