import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { CommandContext } from "../../structures/CommandContext";
import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";

@DefineCommand({
    contextUser: "Mute Member",
    description: "Mute someone on the server",
    name: "mute",
    slash: {
        options: [
            {
                description: "Who do you like to mute?",
                name: "member",
                required: true,
                type: "USER"
            },
            {
                description: "Mute reason",
                name: "reason",
                required: false,
                type: "STRING"
            }
        ]
    }
})
export class MuteCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<any> {
        if (!ctx.member?.permissions.has("MANAGE_ROLES")) return ctx.reply({ embeds: [createEmbed("error", "Sorry, but you don't have **`MANAGE ROLES`** permission to use this command.", true)] });
        if (!ctx.guild?.me?.permissions.has("MANAGE_ROLES")) return ctx.reply({ embeds: [createEmbed("error", "Sorry, but I don't have **`MANAGE ROLES`** permission.", true)] });

        const memberId = ctx.args.shift()?.replace(/[^0-9]/g, "") ?? ctx.options?.getUser("user")?.id ?? ctx.options?.getUser("member")?.id;
        const member = ctx.guild.members.resolve(memberId!);

        if (!member) return ctx.reply({ embeds: [createEmbed("warn", "Please specify someone.")] });

        const muteRole = await this.client.utils.fetchMuteRole(ctx.guild);

        const mute = await member.roles.add(muteRole, ctx.options?.getString("reason") ?? (ctx.args.length ? ctx.args.join(" ") : "[Not Specified]"))
            .catch(err => new Error(err));
        if (mute instanceof Error) return ctx.reply({ embeds: [createEmbed("error", `Unable to mute member. Reason:\n\`\`\`${mute.message}\`\`\``)] });

        return ctx.reply({ embeds: [createEmbed("success", `**${member.user.tag}** has been **\`MUTED\`**.`, true)] });
    }
}
