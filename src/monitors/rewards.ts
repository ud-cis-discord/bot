import { Monitor, MonitorStore, KlasaMessage } from 'klasa';
import { DMChannel, TextChannel } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { Reward } from '@lib/types/reward';


export default class extends Monitor {

	public constructor(store: MonitorStore, file: string[], directory: string) {
		super(store, file, directory, { ignoreOthers: false });
	}

	public async run(msg: KlasaMessage): Promise<void> {
		if (msg.channel instanceof DMChannel) return;

		const rewards: Reward[] = msg.guild.settings.get(GuildSettings.Rewards);
		const reward = rewards.filter(r => r.channelID === msg.channel.id)[0];

		if (!reward) return;

		const chan = msg.guild.channels.cache.get(reward.channelID) as TextChannel;
		const role = await msg.guild.roles.fetch(reward.roleID);
		const msgNum = await chan.messages.fetch({ limit: 100 }).then(messages => messages.filter(m => m.author.id === msg.author.id).size);

		if (msg.member.roles.cache.has(role.id)) return;

		if (msgNum >= reward.msgCount) {
			msg.member.roles.add(role);
			msg.reply(`${reward.displayMessage} You have earned the ${role.name} role!`);
		}
	}

}
