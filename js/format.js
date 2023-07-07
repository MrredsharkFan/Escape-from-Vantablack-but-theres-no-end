function toPlaces(x, precision, maxAccepted) {
	x = new Decimal(x)
	let result = x.toStringWithDecimalPlaces(precision)
	if (new Decimal(result).gte(maxAccepted)) {
		result = new Decimal(maxAccepted-Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
	}
	return result
}

function exponentialFormat(num, precision) {
	let e = num.log10().floor()
	let m = num.div(Decimal.pow(10, e))
	if (m.gte(10)) {
		m = m.div(10);
		e = e.plus(1);
	} else if (m.gte(9.999999999)) {
		m = new Decimal(1)
		e = e.plus(1);
	}
	return toPlaces(m, precision, 10)+"e"+formatWhole(e)
}

function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	if (num.mag < 0.001) return (0).toFixed(precision)
	return toPlaces(num, precision, 1e9).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function sumValues(x) {
	x = Object.values(x)
	if (!x[0]) return new Decimal(0)
	return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision=2) {
	if (decimal=="X") return "X"
	decimal = new Decimal(decimal)
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		player.hasNaN = true;
		return "NaN"
	}
	if (decimal.sign<0) return "-"+format(decimal.neg(), precision)
	if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
	if (decimal.gte("eeee10")) {
		var slog = decimal.slog()
		if (slog.gte(1e9)) return "10^^" + format(slog.floor())
		else if (slog.gte(1000)) return "10^^"+commaFormat(slog, 0)
		else return "10^^" + commaFormat(slog, 2)
	} else if (decimal.gte("eee1e6")) return "e"+formatWhole(decimal.log10(), 2)
	else if (decimal.gte(1e9)) return standard(decimal, 3)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}

function formatWhole(decimal) {
	return format(decimal, 0)
}

function formatWhether(decimal) {
	if (Decimal.eq(decimal, Decimal.round(decimal))) return formatWhole(decimal);
	else return format(decimal);
}

function formatTime(decimal, precision=2) {
	if (decimal=="X") return "X"
	decimal = new Decimal(decimal)
	if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
		player.hasNaN = true;
		return "NaN"
	}
	if (decimal.sign<0) return "-"+formatTime(decimal.neg(), precision)
	if (decimal.lt(1)) return format(decimal.times(1e3), precision)+"ms";
	else if (decimal.lt(60)) return format(decimal, precision)+"s";
	else if (decimal.lt(3600)) return formatWhole(decimal.div(60).floor())+"m "+format(decimal.sub(decimal.div(60).floor().times(60)), precision)+"s";
	else if (decimal.lt(86400)) return formatWhole(decimal.div(3600).floor())+"h "+format(decimal.div(60).sub(decimal.div(3600).floor().times(60)).floor(), precision)+"m";
	else if (decimal.lt(31556736)) return formatWhole(decimal.div(86400).floor())+"d "+format(decimal.div(3600).sub(decimal.div(86400).floor().times(24)).floor(), precision)+"h";
	else if (decimal.lt(31556736000)) return formatWhole(decimal.div(31556736).floor())+"y "+format(decimal.div(86400).sub(decimal.div(31556736).floor().times(365.24)).floor(), precision)+"d";
	else return formatWhole(decimal.div(31556736).floor())+"y"
}

function isFunc(f) {
	let n = {};
	return n.toString.call(f) === '[object Function]';
}

function checkFunc(f) {
	if (isFunc(f)) return f();
	else return f;
}

function NaNCheck(x, d=false) {
	if (d) {
		x = new Decimal(x);
		if (isNaN(x.sign)||isNaN(x.layer)||isNaN(x.mag)) return new Decimal(0);
		else return x;
	} else {
		if (isNaN(x)) return 0;
		else return x;
	}
}

//hey vorona, your notations are so tasty >:) eiorfoweifweofejfioewfweoijef
function t1format(x,mult=false,y) {
	let ills = ['','M','B','T','Qa','Qi','Sx','Sp','Oc','No']
	let t1ones = ["","U","D","T","Qa","Qi","Sx","Sp","Oc","No"]
	if (mult && y>0 && x<10) t1ones = ["","","D","T","Qa","Qi","Sx","Sp","Oc","No"]
	let t1tens = ["","Dc","Vg","Tg","Qag","Qig","Sxg","Spg","Ocg","Nog"]
	let t1hunds = ["","Ce","De","Te","Qae","Qie","Sxe","Spe","Oce","Noe"]
	let t1f = ills[x]
	if (mult && y>0) t1f = t1ones[x]
	if (x>=10) t1f = t1ones[x%10]+t1tens[Math.floor(x/10)%10]+t1hunds[Math.floor(x/100)]
	return t1f
}

function t2format(x,mult=false,y) {
	let t2ills = ["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"]
	let t2ones = ["","Me","Du","Tr","Te","Pe","He","Hp","Ot","En"]
	if (mult && y>0 && x<10) t2ones = ["","","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"]
	let t2tens = ["","c","Ic","TCn","TeC","PCn","HCn","HpC","OCn","ECn"]
	let t2hunds = ["","Hc","DHe","THt","TeH","PHc","HHe","HpH","OHt","EHc"]
	let t2f = t2ills[x]
	if (mult && y>0) t2f = t2ones[x]
	let t2t = t2tens[Math.floor(x/10)%10]
	if (x%100==10) t2t='Vec'
	if (x>=10) t2f = t2ones[x%10]+t2t+t2hunds[Math.floor(x/100)]
	return t2f
}

function t3format(x,mult=false,y,z) {
	let t3ills = ["","Kl","Mg","Gi","Ter","Pt","Ex","Zt","Yt","Xe"]
	let t3ones = ["","eN","oD","tR","tE","pT","eX","zE","yO","xN"]
	let t3tns = ["Dk","Hn","Dok","TrD","TeD","PeD","ExD","ZeD","YoD","NeD"]
	let t3to = ["k","k","c","c","c","k","k","c","k","c"]
	if (mult && y>0 && x<10) t3ones = ["","","D","Tr","T","P","Ex","Z","Y","N"]
	let t3tens = ["","","I","Tr","Te","P","E","Z","Y","N"]
	let t3hunds = ["","Ho","Do","Tro","To","Po","Exo","Zo","Yo","No"]
	let t3f = t3ills[x]
	if ((mult && y>0) || z>=1e3) t3f = t3ones[x]
	let t3t = t3tens[Math.floor(x/10)%10]
	let t3h = t3hunds[Math.floor(x/100)]
	if (x%100==0) t3h+='T'
	if (x%100<20&&x%100>9) t3t = t3tns[x%10]
	if (x%100>19) t3t += t3to[x%10]+t3ones[x%10]
	if (x>=10) t3f = t3h+t3t
	if (x>=100&&x%100<10) t3f = t3h+t3ones[x%10]
	return t3f
}

function t4format(x,m) {
	let t4ills = ["","aL","eJ","iJ","AsT","uN","rM","oV","oL","eT","O","aX","uP","rS","lT"]
	let t4m = ["","K","M","G","","L","F","J","S","B","Gl","G","S","V","M"]
	let t4f = t4ills[x]
	if (m<2) t4f = t4m[x]+t4f
	return t4f
}

function standard(decimal, precision){
	decimal = new Decimal(decimal)
	if (decimal.sign < 0) return "-"+standard(decimal.neg(), precision)
	if (decimal.layer > 4 && decimal.mag>=0 || (decimal.mag >= Math.log10(3e45) && decimal.layer == 4)) {
		var slog = decimal.slog()
		if (slog.gte(1e9)) return "F" + formatWhole(slog.floor())
		if (slog.gte(100)) return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
		else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(4) + "F" + commaFormat(slog.floor(), 0)
	}
	let illion = decimal.log10().div(3).floor().sub(1)
	let m = decimal.div(Decimal.pow(1e3,illion.add(1)))
	if (m.toStringWithDecimalPlaces(precision) == 1000) {
		m = new Decimal(1)
		illion = illion.add(1)
	}
	if (decimal.log10().lt(1e9)) m = m.toStringWithDecimalPlaces(precision)+' '
	else m = ''
	let t2illion = illion.max(1).log10().div(3).floor()
	let t3illion = t2illion.max(1).log10().div(3).floor()
	let t4illion = t3illion.max(1).log10().div(3).floor()
	let t1 = illion.div(Decimal.pow(1e3,t2illion.sub(2))).floor().toNumber()
	if (illion.lt(1e3)) t1 = illion.toNumber()
	let t2 = t2illion.div(Decimal.pow(1e3,t3illion.sub(2))).floor().toNumber()
	if (t2illion.lt(1e3)) t2 = t2illion.toNumber()
	let t3 = t3illion.div(Decimal.pow(1e3,t4illion.sub(2))).floor().toNumber()
	if (t3illion.lt(1e3)) t3 = t3illion.toNumber()
	let t4 = t4illion.toNumber()
	let st = t1format(t1)
	if (illion.gte(1e3)) st = t1format(Math.floor(t1/1e6),true,t2)+t2format(t2)+((Math.floor(t1/1e3)%1e3>0)?('-'+t1format(Math.floor(t1/1e3)%1e3,true,t2-1)+t2format(t2-1)):'')
	if (illion.gte(1e6)) st += ((t1%1e3>0)?('-'+t1format(t1%1e3,true,t2-2)+t2format(t2-2)):'')
	if (t2illion.gte(1e3)) st = t2format(Math.floor(t2/1e6),true,t3)+t3format(t3)+((Math.floor(t2/1e3)%1e3>0)?("a'-"+t2format(Math.floor(t2/1e3)%1e3,true,t3-1)+t3format(t3-1)):'')
	if (t2illion.gte(1e6)) st += ((t2%1e3>0)?("a'-"+t2format(t2%1e3,true,t3-2)+t3format(t3-2)):'')
	if (t3illion.gte(1e3)) st = t3format(Math.floor(t3/1e6),true,t4)+t4format(t4,Math.floor(t3/1e6))+((Math.floor(t3/1e3)%1e3>0)?("`-"+t3format(Math.floor(t3/1e3)%1e3,true,t4-1,t3)+t4format(t4-1,Math.floor(t3/1e3)%1e3)):'')
	if (t3illion.gte(1e6)) st += ((t3%1e3>0)?("`-"+t3format(t3%1e3,true,t4-2,t3)+t4format(t4-2,t3%1e3)):'')
	if (decimal.mag >= 1e9 || (decimal.layer>0 && decimal.mag>=0))return m+st
	if (decimal.mag >= 1e3) return commaFormat(decimal, 0)
	if (decimal.mag >= 0.001) return regularFormat(decimal, precision)
	if (decimal.sign!=0) return '1/'+standard(decimal.recip(),precision)
	return regularFormat(decimal, precision)
}