import { Inhibitor, KlasaMessage, InhibitorStore } from 'klasa';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends Inhibitor {

	public constructor(store: InhibitorStore, file: string[], directory: string) {
		super(store, file, directory, { spamProtection: true });
	}
	public async run(msg: KlasaMessage): Promise<void> {
		if (msg.channel.type === 'dm') return;

		const muted = msg.guild.settings.get(GuildSettings.Roles.Muted);
		if (msg.member.roles.cache.has(muted)) throw 'Muted perople cant use commands';
	}

}
