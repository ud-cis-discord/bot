/* eslint-disable id-length */
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage } from 'klasa';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Message, Role, TextChannel } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';
import { Reward } from '@lib/types/reward';
import { newEmbed } from '@lib/util/util';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Add a role reward',
			helpUsage: '<role> | <channel> | <threshold> | <nessage>',
			permissionLevel: PermissionLevels.ADMINISTRATOR,
			runIn: ['text'],
			usage: '<role:rolename><channel:channelname><threshold:number><message:string>'
		});
	}

	public async run (msg :KlasaMessage, [role, channel, threshold, message]: [Role, TextChannel, number, string]): Promise<Message> {
		const newReward: Reward = { roleID: role.id, channelID: channel.id, msgCount: threshold, displayMessage: message };
		const rewards: Reward[] = msg.guild.settings.get(GuildSettings.Rewards);
		if (rewards.filter(r => r.channelID === newReward.channelID).length > 0) throw `There is already a reward for ${channel.name}!`;
		if (threshold >= 100) throw 'The threshold must be less than 100!';

		await msg.guild.settings.update(GuildSettings.Rewards, newReward, { action: 'add' });

		const embed = newEmbed()
			.setTitle('Added reward')
			.addFields(
				{ name: 'Channel', value: channel, inline: true },
				{ name: 'Role', value: role, inline: true },
				{ name: 'Threshold', value: threshold, inline: true },
				{ name: 'Display message', value: message }
			)

		return msg.channel.send(embed);
	}
}

