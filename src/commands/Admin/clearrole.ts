import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { Message, Role } from 'discord.js';
import { CommandStore, KlasaMessage } from 'klasa';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			aliases: ['crole', 'cr'],
			description: 'Quickly remove all members from the specified role',
			permissionLevel: 10,
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES'],
			usage: '<role:rolename>'
		});
	}

	public async run(msg: KlasaMessage, [role]: [Role]): Promise<Message> {
		const res = await msg.channel.send('<a:loading:755121200929439745> Working...');
		await msg.guild!.members.fetch();
		const { size } = role.members;

		if (size < 1) return res.edit(`There are no members in the ${role.name} role.`);

		for (const [id, member] of role.members) { // eslint-disable-line @typescript-eslint/no-unused-vars
			if (member.roles.cache.has(role.id)) await member.roles.remove(role.id);
		}

		return res.edit(`${size} members were removed from the ${role.name} role.`);
	}

}