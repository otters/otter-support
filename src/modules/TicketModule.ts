import { Message } from 'discord.js';
import { command, default as CookiecordClient, Module } from 'cookiecord';

export default class TicketModule extends Module {
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

    return channel.send(msg.author, {
      embed: {
        color: '#2ed573',
        title: 'Ticket successfully created!',
        description: `Hey there, ask your question and a staff member will soon be here to help you!`,
        timestamp: new Date(),
        footer: { text: '© Otters | Yet another sneaker dashboard.' },
      },
    });
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

    const currentChannel = channels?.cache.find(channel => channel.id === msg.channel.id);

    const regex = currentChannel?.name.match(/^support-.*-[0-9]{4}$/);

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
        description: 'This ticket will be deleted in 5 seconds',
        timestamp: new Date(),
        footer: { text: '© Otters | Yet another sneaker dashboard.' },
      },
    });

    setTimeout(async () => {
      await supportChannel.delete('Support ticket closed');
    }, 5000);
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
        description: 'This ticket will be deleted in 5 seconds',
        timestamp: new Date(),
        footer: { text: '© Otters | Yet another sneaker dashboard.' },
      },
    });

    setTimeout(async () => {
      await supportChannel.delete('Support ticket closed by admin');
    }, 5000);
  }
}
