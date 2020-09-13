import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { DMChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Levels } from '@lib/types/levels';

export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false });
	}

	public async run(msg: KlasaMessage): Promise<void> {
		if (msg.command !== null) return;

		if (msg.channel instanceof DMChannel) return;

		const noLevelRole = await msg.guild.settings.get(GuildSettings.Roles.NoLevels);

		if (noLevelRole.filter((r: string) => msg.member.roles.cache.has(r)).length > 0) return;

		const noLevelchan = await msg.guild.settings.get(GuildSettings.Channels.NoLevles);
		if (noLevelchan.includes(msg.channel.id)) return;

		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		const powerUser = msg.guild.roles.cache.get(await msg.guild.settings.get(GuildSettings.Roles.PowerUser));
		const powerLimit = await msg.guild.settings.get(GuildSettings.Roles.PowerUserLimit);

		if (levels.filter(level => level.user === msg.author.id).length === 0) {
			const newUser: Levels = { user: msg.author.id, level: 1 };
			await msg.guild.settings.update(GuildSettings.Levels, newUser, { action: 'add' });
		} else {
			const levelsClone = levels.slice();
			const index = levelsClone.map(level => level.user).indexOf(msg.author.id);
			levelsClone[index].level++;
			if (powerUser && levelsClone[index].level >= powerLimit) {
				if (!msg.member.roles.cache.has(powerUser.id)) {
					msg.member.roles.add(powerUser);
					msg.channel.send(`Woo ${msg.member}, you have been quite active this past week! You just earned yourself the ${powerUser.name} role.`);
				}
			}
			await msg.guild.settings.update(GuildSettings.Levels, levelsClone, { action: 'overwrite' });
		}

		return;
	}

}
