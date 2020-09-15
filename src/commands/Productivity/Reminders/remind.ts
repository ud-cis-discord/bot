import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { friendlyDuration } from '@lib/util/util';
import { NAME } from '@root/config';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['remindme'],
			description: 'Set personal reminders for yourself.',
			examples: ['remind make steve suck less|1 hour'],
			extendedHelp: `If you set a reminder in a DM with ${NAME}, the reminder will be in the DM.`,
			usage: '<reminder:string{,140}> <duration:timespan>',
			helpUsage: 'what | when'
		});
	}

	public async run(msg: KlasaMessage, [reminder, duration]: [string, number]): Promise<Message> {
		const userReminders = await this.client.schedule.getUserReminders(msg.author.id);
		const prodRole = await msg.guild.settings.get(GuildSettings.Roles.ProdMaster);
		const prodLimit = await msg.guild.settings.get(GuildSettings.Roles.ProdMasterLimit);
		if (prodRole && userReminders.length >= prodLimit - 1 && !msg.member.roles.cache.has(prodRole)) {
			msg.member.roles.add(prodRole);
			msg.reply('someone is being productive! You are now a Productivity Master!');
		}

		const reminderChannel = msg.guild ? msg.guild.settings.get(GuildSettings.Channels.ReminderChannel) : null;

		await this.client.schedule.createReminderTask(msg.author.id, reminder, duration, msg.channel instanceof TextChannel && reminderChannel ? reminderChannel : msg.channel.id);

		return msg.channel.send(`${msg.author}, I'll remind you about that in ${friendlyDuration(duration)}.`);
	}

}
