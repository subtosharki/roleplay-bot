import { EmbedBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { commands } from '..';

export = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of commands')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('Command to search for')
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction) {
        if (interaction.isChatInputCommand()) {
            if (interaction.inCachedGuild()) {
                let avatar = interaction.member?.user.avatar;
                let userID = interaction.member?.id;
                let author = interaction.member?.user.tag;

                const main = new EmbedBuilder()
                    .setColor('#004cff')
                    .setAuthor({
                        name: `${author}`,
                        iconURL: `https://cdn.discordapp.com/avatars/${userID}/${avatar}.webp?size=256`,
                    })
                    .setTitle('Command List')
                    .setTimestamp();

                for (let i = 0; i < commands.length; i++) {
                    main.addFields([
                        {
                            name: commands[i].name,
                            value: commands[i].description,
                        },
                    ]);
                }
                if (interaction.options.getString('command')) {
                    const cmdsearch = interaction.options.getString('command');
                    const command = commands.find(
                        (c: any) => cmdsearch == c.name
                    );
                    const Search = new EmbedBuilder()
                        .setColor('#004cff')
                        .setAuthor({
                            name: `${author}`,
                            iconURL: `https://cdn.discordapp.com/avatars/${userID}/${avatar}.webp?size=256`,
                        })
                        .addFields([
                            { name: command.name, value: command.description },
                        ])
                        .setFooter({ text: 'Command Search' })
                        .setTimestamp();

                    const Error = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setAuthor({
                            name: `${author}`,
                            iconURL: `https://cdn.discordapp.com/avatars/${userID}/${avatar}.webp?size=256`,
                        })
                        .setTitle(`Command name ${cmdsearch} not found.`)
                        .setFooter({ text: 'Command Search' })
                        .setTimestamp();

                    if (!command) {
                        await interaction.reply({
                            embeds: [Error],
                            ephemeral: true,
                        });
                    } else {
                        await interaction.reply({
                            embeds: [Search],
                            ephemeral: true,
                        });
                    }
                } else {
                    await interaction.reply({
                        embeds: [main],
                        ephemeral: true,
                    });
                }
            }
        }
    },
};
