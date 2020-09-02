import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { Message, DMChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { PermissionLevels } from '@lib/types/enums';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false, ignoreEdits: false });
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		if (msg.channel instanceof DMChannel) return;

		const trusted = msg.guild.settings.get(GuildSettings.Roles.Trusted);
		if (trusted === null) return;
		if (msg.command === null) return;

		if (msg.command.permissionLevel === PermissionLevels.TRUSTED && !msg.member.roles.cache.has(trusted)) {
			msg.reply('you have to verify before you can do that. Go to <https://ud-cis-discord.github.io/verify/> for more information');
		}

		return;
	}

}
