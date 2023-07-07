function truePhotonBtn(n) {
	if (tmp.lsel==n) player.truePhotBought++;
	else player.badTruePhotBought++;
	player.truePhotons = player.truePhotons.plus(1);
}

function getLSel(x) {
	if (x.lt(getTruPhotReq())) return 0;
	x = x.toNumber();
	return Math.max(Math.ceil(Math.abs(Math.sin(x)*tmp.tphr*tmp.tphc)), 1);
}

function getTruPhotReq() {
	let b = player.truePhotBought+player.badTruePhotBought;
	return Math.pow(b, 1.1)*3;
}

function getTPHRows() {
	return 1
}

function getTPHCols() {
	return 1
}