import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, GuildMember } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Levels } from '@lib/types/levels';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { newEmbed } from '@lib/util/util';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Looks up a users verification information',
			requiredPermissions: PermissionLevels.MODERATOR,
			runIn: ['text'],
			usage: '<targetMember:membername>',
			helpUsage: 'member'
		});
	}

	public async run(msg: KlasaMessage, [targetMember]: [GuildMember]): Promise<Message> {
		if (!targetMember) throw `You must provide either a valid member's name, their long ID, or tag them.`;
		const fetchedMember = await msg.guild.members.fetch(targetMember);

		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		const hasLevel = !(levels.filter(level => level.user === fetchedMember.id).length === 0);
		const name = fetchedMember.user.settings.get(UserSettings.Details.Name);
		const email = fetchedMember.user.settings.get(UserSettings.Details.Email);
		const udid = fetchedMember.user.settings.get(UserSettings.Details.UDID);

		const embed = newEmbed()
			.setAuthor(fetchedMember.user.tag, fetchedMember.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`Discord ID ${fetchedMember.id}`);

		if (!(name === null && email === null && udid === null)) {
			embed.addFields([
				{ name: 'Name', value: name, inline: true },
				{ name: 'Email', value: email, inline: true },
				{ name: 'UDID', value: udid, inline: true }
			]);
		} else {
			embed.setDescription('This user has not yet been verified');
		}


		if (hasLevel) {
			embed.addField('Message Count', levels[levels.slice().map(level => level.user).indexOf(fetchedMember.id)].level, true);
		} else {
			embed.addField('Message Count', 'This user has sent no messages', true);
		}

		return msg.channel.send(embed);
	}

}
