const VkBot = require("node-vk-bot-api");
const Session = require("node-vk-bot-api/lib/session");
const Stage = require("node-vk-bot-api/lib/stage");
const Markup = require("node-vk-bot-api/lib/markup");

const reg_sesson = require("./reg_session");
const GoogleSheets = require("./google_sheets");

const bot = new VkBot("d847617cb77669c9e9e4d4f1f3aaaa54139701198499251c1edd72a54f33697cb39f09ad63fe86b60ecaf");

bot.use(async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		console.error(e);
	}
});

const session = new Session();

const stage = new Stage(reg_sesson);

bot.use(session.middleware());
bot.use(stage.middleware());

bot.command(["Начать", "Start", "Заполнить снова"], async ctx => {
	await ctx.scene.enter("reg");
});

bot.command("/рассылка", async ctx => {
	const sheets = new GoogleSheets();
	await sheets.logInGoogle();
	const vk_ids = await sheets.getVKIds();
	const massMessage = ctx.message.text.replace("/рассылка", "");
	for (const id of vk_ids) {
		await bot.sendMessage(id, massMessage);
	}
	await ctx.reply("Рассылка успешно отправлена");
});

bot.startPolling(err => {
	if (err) {
		console.error(err);
	}
});
