import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, GuildMember } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Levels } from '@lib/types/levels';
import { PermissionLevels } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Lets you check the level of another user.',
			permissionLevel: PermissionLevels.MODERATOR,
			aliases: ['lc'],
			runIn: ['text'],
			usage: '[member:membername]',
			helpUsage: 'member'
		});
		this.createCustomResolver('membername', (str, possible, msg) => {
			const arg = this.client.arguments.get('membername');

			return str ? arg.run(str, possible, msg) : arg.run(msg.member.user.tag, possible, msg);
		});
	}

	public async run(msg: KlasaMessage, [targetMember]: [GuildMember]): Promise<Message> {
		if (!targetMember) throw `You must provide either a valid member's name, their long ID, or tag them.`;
		const fetchedMember = await msg.guild.members.fetch(targetMember);

		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		if (levels.filter(level => level.user === fetchedMember.id).length === 0) {
			return msg.channel.send(`It looks like ${fetchedMember.displayName} has sent no messages`);
		} return msg.channel.send(`${fetchedMember.displayName} has sent ${levels[levels.slice().map(level => level.user).indexOf(fetchedMember.id)].level} messages`);
	}

}
