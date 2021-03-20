/**
 * Main function of small event
 * @param {module:"discord.js".Message} message
 * @param {"fr"|"en"} language
 * @param {Entities} entity
 * @returns {Promise<>}
 */
const executeSmallEvent = async function (message, language, entity) {

	let RandomItem = await entity.Player.Inventory.generateRandomItem(5);
	let price = getItemValue(RandomItem);
	if (randInt(1, 10) === 10) {
		price *= 4;
	} else {
		price *= 0.6;
	}
	price = Math.round(price);
	message.channel.send();
};

module.exports = {
	executeSmallEvent: executeSmallEvent
};