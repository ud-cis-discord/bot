import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';
import { Levels } from '@lib/types/levels';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { formatDate } from '@lib/util/util';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Resets a users levels',
			aliases: ['export', 'getcsv', 'report'],
			permissionLevel: PermissionLevels.ADMINISTRATOR,
			runIn: ['text']
		});
	}

	public async run(msg: KlasaMessage): Promise<Message> {
		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		let buff: string = 'Display name,Messages sent\n';
		levels.forEach(level =>{
			buff += `${msg.guild.members.cache.get(level.user).displayName},${level.level}\n`;
		});

		return msg.channel.sendFile(Buffer.from(buff),`export_${formatDate(Date.now(), 'M-D-YY_HH-mm-ss')}.csv`,'Don\'t forget to reset all levels');
	}

}
