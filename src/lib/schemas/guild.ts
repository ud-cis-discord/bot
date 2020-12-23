import { Client } from 'klasa';

export default Client.defaultGuildSchema
	.add('channels', channels => channels
		.add('memberlog', 'TextChannel')
		.add('modlog', 'TextChannel')
		.add('reminderChannel', 'TextChannel')
		.add('serverlog', 'TextChannel')
		.add('noLevels', 'TextChannel', { array: true })
		.add('archive', 'CategoryChannel'))
	.add('roles', roles => roles
		.add('administrator', 'Role')
		.add('assignable', 'Role', { array: true })
		.add('deafened', 'Role')
		.add('dj', 'Role')
		.add('moderator', 'Role')
		.add('muted', 'Role')
		.add('private', 'Role', { array: true })
		.add('trusted', 'Role')
		.add('giveTrustedRoleOn', 'TrustedRoleSetting', { default: 'none' })
		.add('noLevels', 'Role', { array: true })
		.add('powerUser', 'Role')
		.add('powerUserLimit', 'Integer', { default: 200 })
		.add('prodMaster', 'Role')
		.add('prodMasterLimit', 'Integer', { default: 5 }))
	.add('music', music => music
		.add('maxEntries', 'Integer', { default: 50 })
		.add('maxLength', 'Integer', { default: 450000 }))
	.add('maxMentions', 'Integer', { default: 25 })
	.add('moderationCases', 'any', { array: true, configurable: false })
	.add('snippets', 'any', { array: true })
	.add('rewards', 'any', { array: true })
	.add('wordBlacklist', 'Boolean', { default: true })
	.add('levels', 'any', { array: true });
