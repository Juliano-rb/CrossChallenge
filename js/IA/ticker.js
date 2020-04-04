class Ticker {
    static start(del, cb) {
        Ticker.callBack = new Array();
        Ticker.run = true;
        if (cb) Ticker.callBack.push(cb);

        Ticker.delay = del;
        Ticker.lastTickTimestamp = new Date().getTime();
        //
        Ticker.tick();
    }
    static tick() {
        if (Ticker.run) {
            //Instante de tempo atual
            var at = new Date().getTime();
            //Variação desde o último ticker
            var delta = at - Ticker.lastTickTimestamp;
            //console.log("Delta: " + delta + " at: " + "LastTimestamplast:" + Ticker.lastTickTimestamp + " Delay:" + Ticker.delay);
            if (delta >= Ticker.delay) {
                //console.log(delta);
                Ticker.lastTickTimestamp = at;

                Ticker.notify();
                //window.dispatchEvent(tick);
                requestAnimationFrame(Ticker.tick);
            } else {
                requestAnimationFrame(Ticker.tick);
            }
        }
    }
    static subscribe(cb) {
        Ticker.callBack.push(cb);
    }
    static clearSubs() {
        Ticker.callBack = new Array();
    }
    static stop() {
        Ticker.run = false;
        Ticker.clearSubs;
    }
    static notify() {
        for (var i = 0; i < Ticker.callBack.length; i++) {
            Ticker.callBack[i]();
        }
    }
}
