import { CommandStore, KlasaMessage, Duration } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message } from 'discord.js';
import { newEmbed } from '@lib/util/util';
import { Colors } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Provides some details about the bot and stats.',
			aliases: ['uptime']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const embed = newEmbed()
			.setColor(Colors.YellowGreen)
			.setTitle('Statistics')
			.setThumbnail(this.client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.addFields([
				{ name: 'Uptime', value: Duration.toNow(Date.now() - (process.uptime() * 1000)), inline: true },
				{ name: 'Users', value: this.client.users.cache.size, inline: true },
				{ name: 'Channels', value: this.client.channels.cache.size, inline: true },
				{ name: 'Servers', value: this.client.guilds.cache.size, inline: true },
				{ name: 'Memory Useage', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
			]);

		return msg.channel.send(embed);
	}

}
