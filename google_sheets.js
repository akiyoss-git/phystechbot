const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./creds.json");

class GoogleSheets {
	constructor() {
		this.doc = new GoogleSpreadsheet("1sTznRo3xE5fS5Mx27pIPPQclrYJp9L7wsC2bmY2uSfI");
	}
	async logInGoogle() {
		await this.doc.useServiceAccountAuth(creds);
		await this.doc.loadInfo();
	}
	async modifySheet() {
		const sheet = this.doc.sheetsByIndex[0];
		await sheet.setHeaderRow(["vk_id", "ФИО", "Институт", "Группа", "Номер команды", "Ссылка"]);
	}
	async appendDataToSheet(vk_id, name, inst, group, teamnum, link) {
		const sheet = this.doc.sheetsByIndex[0];
		await sheet.addRow({
			vk_id: vk_id,
			ФИО: name,
			Институт: inst,
			Группа: group,
			"Номер команды": teamnum,
			Ссылка: link,
		});
	}
	async getVKIds() {
		const sheet = this.doc.sheetsByIndex[0];
		const rows = await sheet.getRows();
		return rows.map(row => row.vk_id);
	}
	async getCommandQuantity() {
		const sheet = this.doc.sheetsByIndex[0];
		const rows = await sheet.getRows();
		let quantitys = {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
			9: 0,
			10: 0,
		};
		for (let row of rows) {
			if (row["Номер команды"]) quantitys[row["Номер команды"]] = quantitys[row["Номер команды"]] + 1;
		}
		return quantitys;
	}
}

module.exports = GoogleSheets;
