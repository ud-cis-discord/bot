import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { CommandStore, KlasaMessage, RichDisplay } from 'klasa';
import { PermissionLevels, Emojis, Colors } from '@lib/types/enums';
import { Role, Message, Snowflake, MessageEmbed } from 'discord.js';
import { GuildSettings } from '@lib/types/settings/GuildSettings';
import { chunk } from '@klasa/utils';

export default class extends SteveCommand {

	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory, {
			description: 'Assign or unassign roles to yourself!',
			examples: ['assign list', 'assign notification squad', 'assign gmt-4|gmt-5'],
			extendedHelp: 'You can use "list" as the argument to get a list of all self-assignable roles in the server. Use `|` to (un)assign multiple roles.',
			permissionLevel: PermissionLevels.TRUSTED,
			requiredPermissions: ['MANAGE_ROLES'],
			requiredSettings: ['roles.trusted'],
			runIn: ['text'],
			subcommands: true,
			usage: '<list|assign:default> (role:assignableRole) [...]',
			helpUsage: '*list* OR role (|role|...)'
		});

		this
			.createCustomResolver('assignableRole', async (str, possible, msg, [action]: string[]): Promise<Role> => {
				if (action === 'list') return null;
				if (!str) throw 'You must supply a valid role.';

				const role: Role = await this.client.arguments.get('rolename').run(str, possible, msg);
				const assignable = msg.guild.settings.get(GuildSettings.Roles.Assignable) as Snowflake[];

				if (!assignable.includes(role.id)) throw `The ${role.name} role is not self-assignable!`;

				return role;
			});
	}

	public async list(msg: KlasaMessage): Promise<Message> {
		let assignables = msg.guild!.settings.get(GuildSettings.Roles.Assignable) as string[]; // eslint-disable-line @typescript-eslint/no-non-null-assertion
		assignables = assignables.slice(); // clone to avoid mutating cache

		// make assignables into an array of role names
		for (let i = 0; i < assignables.length; i++) {
			const role = msg.guild!.roles.cache.get(assignables[i]); // eslint-disable-line @typescript-eslint/no-non-null-assertion
			if (role) assignables.splice(i, 1, role.name);
		}

		const response = await msg.send(new MessageEmbed()
			.setDescription('Loading...')
			.setColor(Colors.Pink));

		const display = new RichDisplay(new MessageEmbed());

		for (const page of chunk(assignables, 30)) {
			const description = `\`${page.join('`, `')}\``;
			display.addPage((embed: MessageEmbed) =>
				embed.setDescription('Use `s;assign <role>` to assign or unassign a role')
					.setTitle('Self Assign')
					.addField('Avaliable Roles', description)
					.setColor(Colors.Pink)
			);
		}

		await display.run(response, { jump: false, time: 60 * 1000 });
		return response;
	}

	public async assign(msg: KlasaMessage, assignableRoles: Role[]): Promise<Message> {
		const removedRoles: string[] = [];
		const addedRoles: string[] = [];

		for (const assignableRole of assignableRoles) {
			const removing = msg.member.roles.cache.has(assignableRole.id);

			if (removing) {
				await msg.member.roles.remove(assignableRole);
				removedRoles.push(assignableRole.name);
			} else {
				await msg.member.roles.add(assignableRole);
				addedRoles.push(assignableRole.name);
			}
		}

		const removedRolesString = removedRoles.length > 0 ? `${Emojis.Minus} Removed role(s): \`${removedRoles.join(', ')}\`.` : null;
		const addedRolesString = addedRoles.length > 0 ? `${Emojis.Plus} Added role(s): \`${addedRoles.join(', ')}\`.` : null;

		return msg.channel.send(`${removedRoles.length ? removedRolesString : ''}\n${addedRoles.length ? addedRolesString : ''}`);
	}

}
