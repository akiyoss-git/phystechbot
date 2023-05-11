const Scene = require("node-vk-bot-api/lib/scene");
const Markup = require("node-vk-bot-api/lib/markup");
const GoogleSheets = require("./google_sheets");

module.exports = new Scene(
	"reg",
	//добавить требования безопасности (и инфу о сотке)
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
		const sheets = new GoogleSheets();
		await sheets.logInGoogle();
		const quantitys = await sheets.getCommandQuantity();
		let markup = [];
		let markupRow = [];
		for (let command in quantitys) {
			if (quantitys[command] < 6) {
				let text = "";
				let raznica = 6 - quantitys[command];
				if (raznica === 1) text = `${command} (Еще ${raznica} место!)`;
				if (raznica > 1 && raznica < 5) text = `${command} (Еще ${raznica} места!)`;
				if (raznica >= 5) text = `${command} (Еще ${raznica} мест!)`;
				markupRow.push(Markup.button(text));
			}
			if (markupRow.length === 2) {
				markup.push(markupRow);
				markupRow = [];
			}
		}
		if (markupRow.length === 1) markup.push(markupRow);
		await ctx.reply("Выберите номер команды:", null, Markup.keyboard(markup).oneTime(true));
	},
	async ctx => {
		let splitted = ctx.message.text.split(" ");
		console.log(splitted);
		ctx.session.team = splitted[0];
		ctx.scene.next();
		await ctx.reply(
			`А теперь поговорим о технике безопасности:

1. Не заходите за оградительную ленту и никак с ней не взаимодействуйте.
2. Не прыгайте со строений, находящихся на территории страйкбольного клуба.
3. Ничего не двигайте: это может повлечь за собой цепную реакцию и обрушить большие массы обломков на вас.
4. He тpoгaйтe порошки, жидкости и другие неизвестные элементы.
5. Никогда не становитесь на край. Это опасно.
6. Находясь на лестнице, не обгоняйте впереди идущего вас человека и не толкайтесь.
7. Не обижайте роботов и других работников АЭС. Слушайтесь их.
8. Курение и употребление спиртного и других одурманивающих веществ строго запрещено.

❗При получении травмы обратитесь к ближайшему роботу или дойдите до комплекса «Челомей». Вам окажут необходимую медицинскую помощь.

Оргвзнос за наше мероприятие составляет 50 рублей.

При любой непонятной ситуации, например, проблема с регистрацией команд (если вы без нее или попали не в ту, в которую хотели) или проблема с оргвзносом, пишите в сообщения группы или https://vk.com/aleksis08. Вам обязательно помогут.`,
			null,
			Markup.keyboard([[Markup.button("Прочитал и согласен")]])
		);
	},
	async ctx => {
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
			let link = `vk.com/id${ctx.message.from_id}`;
			await sheets.appendDataToSheet(
				ctx.message.from_id,
				ctx.session.fio,
				ctx.session.inst,
				ctx.session.group,
				ctx.session.team,
				link
			);
			await ctx.reply("Ваши данные обрабатываются и скоро будут проверены.");
		} else {
			await ctx.reply(
				"Заполните форму снова",
				null,
				Markup.keyboard([[Markup.button("Заполнить снова")]]).oneTime(true)
			);
		}
	}
);
