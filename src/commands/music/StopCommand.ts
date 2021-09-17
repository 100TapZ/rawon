import { CommandContext } from "../../structures/CommandContext";
import { BaseCommand } from "../../structures/BaseCommand";
import { createEmbed } from "../../utils/createEmbed";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtils";

@DefineCommand({
    aliases: ["st", "disconnect", "dc"],
    description: "Stop the music player",
    name: "stop",
    slash: {
        name: "stop"
    },
    usage: "{prefix}stop"
})
export class StopCommand extends BaseCommand {
    @inVC()
    @validVC()
    @sameVC()
    public execute(ctx: CommandContext): any {
        ctx.guild?.queue?.songs.clear();
        ctx.guild?.queue?.player?.stop(true);
        ctx.guild!.queue!.lastMusicMsg = null;

        ctx.reply({ embeds: [createEmbed("info", "⏹ **|** The music player has been stopped")] }).catch(e => this.client.logger.error("STOP_CMD_ERR:", e));
    }
}
