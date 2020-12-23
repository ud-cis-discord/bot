/* eslint-disable @typescript-eslint/no-namespace */

export namespace GuildSettings {

	export const DisabledCommands = 'disabledCommands';
	export const DisableNaturalPrefix = 'disableNaturalPrefix';
	export const Language = 'language';
	export const MaxMentions = 'maxMentions';
	export const ModerationCases = 'moderationCases';
	export const Prefix = 'prefix';
	export const Snippets = 'snippets';
	export const WordBlacklist = 'wordBlacklist';
	export const Levels = 'levels';
	export const Rewards = 'rewards';

	export namespace Channels {
		export const Memberlog = 'channels.memberlog';
		export const Modlog = 'channels.modlog';
		export const ReminderChannel = 'channels.reminderChannel';
		export const Serverlog = 'channels.serverlog';
		export const NoLevles = 'channels.noLevels';
		export const Archive = 'channels.archive';
	}

	export namespace Roles {
		export const Administrator = 'roles.administrator';
		export const Assignable = 'roles.assignable';
		export const Deafened = 'roles.deafened';
		export const DJ = 'roles.dj';
		export const Moderator = 'roles.moderator';
		export const Muted = 'roles.muted';
		export const Private = 'roles.private';
		export const Trusted = 'roles.trusted';
		export const GiveTrustedRoleOn = 'roles.giveTrustedRoleOn';
		export const NoLevels = 'roles.noLevels';
		export const PowerUser = 'roles.powerUser';
		export const PowerUserLimit = 'roles.powerUserLimit';
		export const ProdMaster = 'roles.prodMaster';
		export const ProdMasterLimit = 'roles.prodMasterLimit';
	}

	export namespace Music {
		export const MaxEntries = 'music.maxEntries';
		export const MaxLength = 'music.maxLength';
	}
}
