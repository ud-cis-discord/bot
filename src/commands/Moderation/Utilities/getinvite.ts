import { CommandStore, KlasaMessage } from 'klasa';
import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message } from 'discord.js';
import { PermissionLevels } from '@lib/types/enums';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Generates an invite link to be given to students',
			aliases: ['getlink', 'link'],
			runIn: ['text'],
			permissionLevel: PermissionLevels.MODERATOR
		});
	}

	public async run(msg: KlasaMessage): Promise<Message | void> {
		const invite = await msg.guild.systemChannel.createInvite({ maxAge: 24 * 60 * 60, maxUses: 1, unique: true, reason: `Requested by ${msg.author.tag}` });

		return msg.author.send('Here is the invite link you requested. It has one use and expires in 24 hours:\n' +
		`\`https://discord.gg/${invite.code} Make sure to get verified https://ud-cis-discord.github.io/verify/students/\``)
			.then(() => { msg.channel.send('An invite link has been sent to your DM\'s'); })
			.catch(() => { msg.channel.send('❌ | You have DMs disabled, I couldn\'t send you the link in DMs.'); });
	}

}
