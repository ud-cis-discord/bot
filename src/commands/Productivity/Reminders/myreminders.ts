import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage, ScheduledTask, RichDisplay } from 'klasa';
import { Message, ColorResolvable, MessageEmbed } from 'discord.js';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { Colors } from '@lib/types/enums';
import { friendlyDuration, newEmbed } from '@lib/util/util';
import { chunk } from '@klasa/utils';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['reminders'],
			description: 'View or cancel your pending reminders.',
			examples: ['myreminders', 'reminders cancel|1'],
			extendedHelp: 'Use "view" to get a list of all of your active reminders. To cancel one or more reminders, use "cancel|rmdr1|rmdr2|...".',
			subcommands: true,
			usage: '<cancel|view:default> (reminder:reminder) [...]',
			helpUsage: '*view* OR *cancel*|reminder number|...'
		});

		this
			.createCustomResolver('reminder', async (str, possible, msg, [action]) => {
				if (action === 'view') return null;

				const num = parseInt(str, 10);
				if (!num) throw `You must provide a valid number.`;

				const reminders = await this.client.schedule.getUserReminders(msg.author.id);
				if (num > reminders.length) throw `You only have ${reminders.length} reminders set!`;

				return reminders[num - 1];
			});
	}

	public async cancel(msg: KlasaMessage, reminders: ScheduledTask[]): Promise<Message> {
		const content = [];

		reminders.forEach(async reminder => {
			const reminderDisplayContent = this.getReminderDisplayContent(msg, reminder);

			content.push(`**${reminderDisplayContent}**`);

			await reminder.delete();
		});

		return msg.channel.send(`Cancelled the following reminder(s): ${content.join('; ')}.`);
	}

	public async view(msg: KlasaMessage): Promise<Message> {
		const targetUserReminders = await this.client.schedule.getUserReminders(msg.author.id);
		if (targetUserReminders.length < 1) throw `You don't have any pending reminders!`;

		const response = await msg.send(new MessageEmbed()
			.setDescription('Loading...')
			.setColor(msg.author.settings.get(UserSettings.EmbedColor) as ColorResolvable || Colors.YellowGreen));

		const display = new RichDisplay(new MessageEmbed());
		for (const page of chunk(targetUserReminders, 5)) {
			const embed = newEmbed()
				.setColor(msg.author.settings.get(UserSettings.EmbedColor) as ColorResolvable || Colors.YellowGreen)
				.setDescription(`To cancel a reminder, do "s;reminders cancel|<reminder number>".`)
				.setTitle('Pending Reminders')
				.setThumbnail('https://raw.githubusercontent.com/ud-cis-discord/bot/prof/assets/images/alarmclock.png');
			page.forEach((reminder: ScheduledTask) => {
				const reminderDisplayContent = this.getReminderDisplayContent(msg, reminder);

				embed
					.addFields([
						{ name: `**${targetUserReminders.indexOf(reminder) + 1}: ${reminderDisplayContent}**`,
							value: `${friendlyDuration(reminder.time.getTime() - Date.now())} left!` }
					]);
			});
			display.addPage(embed);
		}

		await display.run(response, { jump: false, time: 5 * 60 * 1000 });
		return response;
	}

	private getReminderDisplayContent(msg: KlasaMessage, reminder: ScheduledTask): string {
		const reminderUser = this.client.users.cache.get(reminder.data.user);
		if (!reminderUser.dmChannel) return reminder.data.content;
		return reminder.data.channel === reminderUser.dmChannel.id && msg.channel.id !== reminderUser.dmChannel.id ? 'Private reminder: content hidden' : reminder.data.content;
	}

}
