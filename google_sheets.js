const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./phystechbot-7523e7a1a1dc.json");

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
		await sheet.setHeaderRow(["vk_id", "ФИО", "Институт", "Группа", "Номер команды"]);
	}
	async appendDataToSheet(vk_id, name, inst, group, teamnum) {
		const sheet = this.doc.sheetsByIndex[0];
		await sheet.addRow({
			vk_id: vk_id,
			ФИО: name,
			Институт: inst,
			Группа: group,
			"Номер команды": teamnum,
		});
	}
	async getVKIds() {
		const sheet = this.doc.sheetsByIndex[0];
		const rows = await sheet.getRows();
		return rows.map(row => row.vk_id);
	}
}

module.exports = GoogleSheets;
