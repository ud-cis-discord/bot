import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { GuildMember, Message } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';
import { Levels } from '@lib/types/levels';
import { GuildSettings } from '@lib/types/settings/GuildSettings';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Resets a users levels',
			examples: ['resetlevel ben855', 'resetlevel ben855|10', 'resetlevel ben855|-2'],
			permissionLevel: PermissionLevels.MODERATOR,
			extendedHelp: 'Using with no value will reset to 0. A positive level will set to that level and a negative will subtract that from their total',
			runIn: ['text'],
			usage: '<targetMember:membername> [resetTo:number]',
			helpUsage: 'member | (level)'
		});
	}

	public async run(msg: KlasaMessage, [targetMember, resetTo]: [GuildMember, number]): Promise<Message> {
		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);

		let startLevel: number = 0;
		if(levels.filter(u => u.user == targetMember.id).length > 0) {
			startLevel = levels[levels.slice().map(u => u.user).indexOf(targetMember.id)].level
		}

		let endLevel : number = 0;
		if(resetTo > 0)
			endLevel = resetTo;
		else if (resetTo < 0)
			endLevel = startLevel + resetTo;
		(endLevel < 0) ? endLevel = 0 : endLevel = endLevel;

		if(levels.filter(u => u.user == targetMember.id).length == 0) {
			const newUser : Levels = { user: targetMember.id, level: endLevel };
			await msg.guild.settings.update(GuildSettings.Levels, newUser, { action: 'add' });
		} else {
			const levelsClone = levels.slice();
			const index = levelsClone.map(u => u.user).indexOf(targetMember.id);
			levelsClone[index].level = endLevel;
			await msg.guild.settings.update(GuildSettings.Levels, levelsClone, { action: 'overwrite' });
		}

		return msg.channel.send(`Reseting ${targetMember.displayName} to ${endLevel}`);	
	}

}
