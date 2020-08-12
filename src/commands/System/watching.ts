import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionLevels } from '@lib/types/enums';
import { CommandStore, KlasaMessage } from 'klasa';
import { TextChannel, GuildChannel } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['everywhere'],
			description: 'I am everywhere',
			runIn: ['text'],
			permissionLevel: PermissionLevels.OWNER
		});
	}

	public async run(msg: KlasaMessage): Promise<void> {
		const _guildChannel = msg.channel as GuildChannel;
		_guildChannel.parent.children.array().forEach(channel => {
			if (channel.type === 'text') {
				const _textChannel = channel as TextChannel;
				_textChannel.send('Ben is everywhere');
			}
		});
	}

}
