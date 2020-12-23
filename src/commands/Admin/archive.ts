import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message, TextChannel } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Quickly send a channel to the archive',
			permissionLevel: 10,
			runIn: ['text'],
			usage: '<channel:channel>'
		});
	}

	public async run(msg: KlasaMessage, [channel]: [TextChannel]): Promise<Message> {
		if (!msg.guild.settings.get(GuildSettings.Channels.Archive)) {
			return msg.channel.send('An archive has not yet been set.');
		}

		return channel.setParent(msg.guild.settings.get(GuildSettings.Channels.Archive))
			.then(newChannel => {
				newChannel.lockPermissions();
				return msg.channel.send(`${channel} has been archived.`);
			})
			.catch(err => msg.channel.send(`An error occured\n\`\`\`js\n${err}\`\`\``));
	}

}
