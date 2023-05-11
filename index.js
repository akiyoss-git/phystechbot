const VkBot = require("node-vk-bot-api");
const Session = require("node-vk-bot-api/lib/session");
const Stage = require("node-vk-bot-api/lib/stage");
const Markup = require("node-vk-bot-api/lib/markup");

const reg_sesson = require("./reg_session");
const GoogleSheets = require("./google_sheets");

const bot = new VkBot(
	"vk1.a.StpIeKj7_vtKEz8UoRks7jFYXlGLLnbDu8JI1Kh7OJkANJ-KKI0_R7PNWgyZLgbf_liQj6blkrDc_GhaPDdhhlwHjgIOnIZWZvsLWBA0ktloDuliJAlzjs5gQKvRIPcIIid9Oz1IdDHPjO4Gyk357LHul0-JrLJPVJ_Xs77QJfNmHfo-_jMxYDafZu4w7SoYV0l_w5khFgsRQ5G8u4kaZA"
);

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

bot.on(async ctx => {
	await ctx.reply("Ваш вопрос был направлен Администрации АЭС, они свяжутся с вами в ближайшее время!");
	await bot.sendMessage(
		174012255,
		`Новый вопрос от vk.com/id${ctx.message.from_id}\n\n"${ctx.message.text}"\n\nЧтобы ответить перейдите в сообщения сообщества по ссылке https://vk.com/gim195315622`
	);
});

bot.startPolling(err => {
	if (err) {
		console.error(err);
	}
});
