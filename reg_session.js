const Scene = require("node-vk-bot-api/lib/scene");
const Markup = require("node-vk-bot-api/lib/markup");
const GoogleSheets = require("./google_sheets");

module.exports = new Scene(
	"reg",
	async ctx => {
		ctx.scene.next();
		await ctx.reply("Введите ФИО: ");
	},
	async ctx => {
		ctx.session.fio = ctx.message.text;
		ctx.scene.next();
		await ctx.reply(
			"Выберите ваш институт:",
			null,
			Markup.keyboard([
				[Markup.button("ИТС", "primary"), Markup.button("ИЯЭиТФ", "primary")],
				[Markup.button("ИПТМ", "primary"), Markup.button("ИРИТ", "primary")],
				[Markup.button("ИНЭУ", "primary"), Markup.button("ИНЭЛ", "primary")],
				[Markup.button("ИФХТиМ", "primary")],
			]).oneTime(true)
		);
	},
	async ctx => {
		ctx.session.inst = ctx.message.text;
		ctx.scene.next();
		await ctx.reply("Введите вашу группу:");
	},
	async ctx => {
		ctx.session.group = ctx.message.text;
		ctx.scene.next();
		await ctx.reply(
			"Выберите номер команды:",
			null,
			Markup.keyboard([
				[Markup.button("1"), Markup.button("2")],
				[Markup.button("3"), Markup.button("4")],
				[Markup.button("5"), Markup.button("6")],
			]).oneTime(true)
		);
	},
	async ctx => {
		ctx.session.team = ctx.message.text;
		ctx.scene.next();
		await ctx.reply(
			`Вы ввели:\nФИО: ${ctx.session.fio}\nИнститут: ${ctx.session.inst}\nГруппа: ${ctx.session.group}\nНомер команды: ${ctx.session.team}\n\nВсё верно?`,
			null,
			Markup.keyboard([[Markup.button("Да")], [Markup.button("Нет")]]).oneTime(true)
		);
	},
	async ctx => {
		ctx.scene.leave();
		if (ctx.message.text === "Да") {
			const sheets = new GoogleSheets();
			await sheets.logInGoogle();
			await sheets.appendDataToSheet(
				ctx.message.from_id,
				ctx.session.fio,
				ctx.session.inst,
				ctx.session.group,
				ctx.session.team
			);
			await ctx.reply("Вы успешно зарегистрировались на мероприятие день физтеха типа даааа");
		} else {
			await ctx.reply(
				"Заполните форму снова",
				null,
				Markup.keyboard([[Markup.button("Заполнить снова")]]).oneTime(true)
			);
		}
	}
);
