function filter(raw) {
	function findStringsInString(string, strings) {
		for (var i = 0; i < strings.length; i++) {
			if (strings[i].search(string) != -1) return true;
		}
		return false;
	}
	var data = JSON.parse(raw);
	var list = [];
	for (var i = 0; i < data.length; i++) {
		if (findStringsInString(data[i].text, ["shooting", "stabbing", "bombing", "burglary", "robbery"])) {
			list.push(data[i]);
		}
	}
	return list;
}