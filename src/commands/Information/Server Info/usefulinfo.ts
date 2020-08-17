import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionLevels } from '@lib/types/enums';
import { CommandStore, KlasaMessage } from 'klasa';
import { Message } from 'discord.js';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Display useful info',
			permissionLevel: PermissionLevels.ADMINISTRATOR
		});
	}

	async run(msg: KlasaMessage): Promise<Message[]> {
		const botChannel = 'Channel ID';

		const setup = '**__Channels and Categories__**\n';

		const bot = '**__Prof. Steve__**\n' +
		'Hello, I\'m Prof. Steve. I am a modified version of SteveBot, a general purpose discord bot, with some added functionality ' +
		`to make online learning easier. In addition to all the stuff I nomally do (find out more by sending \`s;help\` in <#${botChannel}>) ` +
		'I also keep track of how many messages you send. This information is used by your Professor to give you participation points. ' +
		'Sending messages in some channels, off topic ones, wont add to your total. These channels are marked in the channel decription. ' +
		'Sending off topic messages in improper channels will cause the staff to lower your message count as they see fit. Bot commands ' +
		'also will not add to your total. If you have any suggestions for stuff you think I should be able to do, send `s;suggest <your ' +
		`idea here>\` in <#${botChannel}> and I'll send Ben a ping. He really does read every suggestion.`;

		const roles = `**__Roles__**\n` +
		'If you don\'t know, Discord uses Roles to give users permissions and as tags. Roles allow staff to post announcments and give ' +
		'names their colors. You can use Steve to assign yourself some roles that will help the staff to help you. To see the list send ' +
		`\`s;assign list\` in <#${botChannel}> and you can give yourself one of those roles using \`s;assing <role name>\`. There is a ` +
		'role for each class and we ask that you assign yourself the role for your class. If you are in more than one CISC class, assign ' +
		'more than one role! We also have the `Notification Squad` role which is used to send notifications about this discord server. ' +
		'If you want to be notified of server announcments, assign this role, if not, don\'t. It\'s that simple!';

		msg.delete();
		return [
			await msg.channel.send({ files: [{ attachment: './assets/images/info.png', name: 'info.png' }] }),
			await msg.channel.send(setup),
			await msg.channel.send(bot),
			await msg.channel.send(roles)
		];
	}

}
