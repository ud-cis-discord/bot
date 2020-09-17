import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message, GuildMember, MessageEmbed } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Levels } from '@lib/types/levels';
import { UserSettings } from '@lib/types/settings/UserSettings';
import { newEmbed } from '@lib/util/util';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Looks up a users verification information and message count.',
			permissionLevel: PermissionLevels.MODERATOR,
			runIn: ['text'],
			usage: '<member:membername|udid:string>',
			helpUsage: '<member|udid>',
			extendedHelp: 'Alows moderaters to look up info using either a udid or a discord account',
			examples: ['lookup Ben855', 'lookup 702425559']
		});
	}

	public async run(msg: KlasaMessage, [person]: [string | GuildMember]): Promise<Message> {
		let targetMember: GuildMember;
		if (typeof person === 'string') {
			msg.guild.members.cache.each(mem => {
				if (mem.user.settings.get('details.udid') === person) targetMember = mem;
			});
		} else {
			targetMember = await msg.guild.members.fetch(person);
		}

		if (targetMember) return msg.channel.send(await this.buildEmbed(msg, targetMember));
		return msg.channel.send('You must provide either a valid member\'s UDID, username, their long ID, or tag them.');
	}

	private async buildEmbed(msg: KlasaMessage, member: GuildMember): Promise <MessageEmbed> {
		const levels: Levels[] = msg.guild.settings.get(GuildSettings.Levels);
		const hasLevel = !(levels.filter(level => level.user === member.id).length === 0);
		const name = member.user.settings.get(UserSettings.Details.Name);
		const email = member.user.settings.get(UserSettings.Details.Email);
		const udid = member.user.settings.get(UserSettings.Details.UDID);

		const embed = newEmbed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`Discord ID ${member.id}`);

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
			embed.addField('Message Count', levels[levels.slice().map(level => level.user).indexOf(member.id)].level, true);
		} else {
			embed.addField('Message Count', 'This user has sent no messages', true);
		}

		return embed;
	}

}
