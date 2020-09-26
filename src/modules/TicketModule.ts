import { Message } from 'discord.js';
import { command, default as CookiecordClient, Module } from 'cookiecord';

export default class TicketModule extends Module {
  constructor(client: CookiecordClient) {
    super(client);
  }

  @command()
  async open(msg: Message) {
    const channels = msg.guild?.channels;

    // We try to fetch a category with the name Support
    const supportCategory = channels?.cache.find(channel => channel.name === 'Support');

    if (!supportCategory) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Please make sure that the server has a Support category!',
        },
      });
    }

    // Here we try to fetch a channel which follows the format support-username-discriminator.
    const supportChannel = channels?.cache.find(
      channel => channel.name === `support-${msg.author.username}-${msg.author.discriminator}`.toLowerCase(),
    );

    // If such a channel exists then the user already has a ticket!
    if (supportChannel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'You already have an open ticket!',
        },
      });
    }

    // If such a channel does not exist we can create one and open a new ticket :)
    const channel = await msg.guild?.channels.create(
      `support-${msg.author.username}-${msg.author.discriminator}`.toLowerCase(),
      {
        type: 'text',
        parent: supportCategory.id,
        topic: `Support ticket for ${msg.author.username} | ${new Date().toJSON().substring(0, 10).replace('T', ' ')}`,
      },
    );

    // Oops, something went wrong creating that ticket
    if (!channel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Something went wrong, try again please',
        },
      });
    }

    // We set specific permission so that the user can access his ticket
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
      },
    });
  }

  @command()
  async close(msg: Message) {
    const channels = msg.guild?.channels;

    // We try to fetch a category with the name Support
    const supportCategory = channels?.cache.find(channel => channel.name === 'Support');

    if (!supportCategory) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Please make sure that the server has a Support category!',
        },
      });
    }

    // Here we try to fetch a channel which follows the format support-username-discriminator.
    const supportChannel = channels?.cache.find(
      channel => channel.name === `support-${msg.author.username}-${msg.author.discriminator}`.toLowerCase(),
    );

    // If no channel exists then the user has no ticket to close
    if (!supportChannel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'You have no open ticket!',
        },
      });
    }

    // Here we fetch the channel where the command was executed and make sure that the user used !close in his own ticket
    const currentChannel = channels?.cache.find(channel => channel.id === msg.channel.id);

    const regex = currentChannel?.name.match(/^support-.*-[0-9]{4}$/);

    if (!regex) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Execute this command inside your ticket!',
        },
      });
    }

    msg.channel.send({
      embed: {
        color: '#2ed573',
        title: 'Successfully closed your ticket!',
        description: 'This ticket will be deleted in 5 seconds',
      },
    });

    setTimeout(async () => {
      await supportChannel.delete('Support ticket closed');
    }, 5000);
  }

  @command()
  async forceclose(msg: Message) {
    const channels = msg.guild?.channels;

    // Make sure that the person using the command is an admin in .env
    if (!process.env.BOT_ADMINS) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Please add adminIDs first',
        },
      });
    }

    const admins = process.env.BOT_ADMINS.split(',');

    if (!admins.includes(msg.author.id)) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'This command can only be executed by admins!',
        },
      });
    }

    // We try to fetch a category with the name Support
    const supportCategory = channels?.cache.find(channel => channel.name === 'Support');

    if (!supportCategory) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Please make sure that the server has a Support category!',
        },
      });
    }

    // Here we fetch the channel where the command was executed and make sure that it is executed inside a ticket
    const supportChannel = channels?.cache.find(channel => channel.id === msg.channel.id);

    const regex = supportChannel?.name.match(/^support-.*-[0-9]{4}$/);

    if (!regex) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'Execute this command inside a ticket!',
        },
      });
    }

    if (!supportChannel) {
      return msg.channel.send({
        embed: {
          color: '#ff4757',
          title: 'You have no open ticket!',
        },
      });
    }

    msg.channel.send({
      embed: {
        color: '#2ed573',
        title: 'Successfully closed the ticket!',
        description: 'This ticket will be deleted in 5 seconds',
      },
    });

    setTimeout(async () => {
      await supportChannel.delete('Support ticket closed by admin');
    }, 5000);
  }
}
