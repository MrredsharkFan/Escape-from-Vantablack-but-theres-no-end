function updateTemp() {
	tmp.cutscene1txt = CUT_DATA[1][player.cutscene1pushes];
	tmp.badEndCutsceneTxt = CUT_DATA[2][player.badEndPushes]; 
	tmp.goodEndCutsceneTxt = CUT_DATA[3][player.goodEndPushes]; // Canon ending :P
	
	tmp.tphr = getTPHRows();
	tmp.tphc = getTPHCols();
	tmp.tphe = player.truePhotons.plus(1).pow(Decimal.pow(1.2, player.truePhotBought).sub(Decimal.pow(1.4, player.badTruePhotBought)));
	tmp.tphs = Decimal.pow(1.01, player.truePhotBought-player.badTruePhotBought);
	tmp.lsel = getLSel(player.truePhotons.floor());
	
	tmp.tph = new Decimal("ee308.254");
	tmp.bw = percent(player.totalPhotons);
	tmp.phr = player.photons;
	tmp.lum = tmp.phr.div(1e16).abs();
	tmp.lumEff = getLumensEff();
	
	tmp.mind = player.mindXP.plus(1).log(5).floor();
	tmp.mindReq = Decimal.pow(5, tmp.mind.plus(1)).sub(1);
	tmp.mnde = tmp.mind.root(2.5).div(3);
	tmp.mnde2 = Decimal.pow(Decimal.add(2, tmp.lu?tmp.lu[5]:1), tmp.mind.root(1.5));
	
	tmp.strength = player.strengthXP.plus(1).log(5).floor();
	tmp.strengthReq = Decimal.pow(5, tmp.strength.plus(1)).sub(1);
	tmp.stre = Decimal.pow(10, (tmp.strength.gte(10)?tmp.strength.times(10).sqrt():tmp.strength).pow(2));
	tmp.stre2 = Decimal.pow(Decimal.add(2, tmp.lu?tmp.lu[5]:1), tmp.strength.root(1.5));
	tmp.msGM = tmp.stre2.times(tmp.lu?tmp.lu[3]:1);
	
	tmp.tpp = player.electrons.plus(player.positrons).plus(player.charge.abs());
	tmp.npp = getNextPP();
	tmp.crge = getChargeEff(player.charge.abs(), player.charge.abs().div(player.charge));
	
	if (!tmp.c) tmp.c = {};
	if (!tmp.x) tmp.x = {};
	if (!tmp.u) tmp.u = {};
	for (let i=1;i<=TOTAL_UPGS;i++) {
		tmp.c[i] = getUpgCost(i);
		tmp.x[i] = getExtraUpgs(i);
		tmp.u[i] = getUpgEff(i);
	}
	
	if (!tmp.lc) tmp.lc = {};
	if (!tmp.lx) tmp.lx = {};
	if (!tmp.lu) tmp.lu = {};
	for (let i=1;i<=TOTAL_LUM_UPGS;i++) {
		tmp.lc[i] = getLumUpgCost(i);
		tmp.lx[i] = getExtraLumUpgs(i);
		tmp.lu[i] = getLumUpgEff(i);
	}
	
	tmp.itv = Decimal.div(2, tmp.u[1]);
}

function percent(x) { 
	let y = new Decimal(x);
	if (y.lte(100)){
		y = new Decimal("100")
	}
	y = Decimal.log10(Decimal.log10(y)).div(Decimal.log10(Decimal.log10(tmp.tph)))
	return y}