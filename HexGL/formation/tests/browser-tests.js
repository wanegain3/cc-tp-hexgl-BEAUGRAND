/* Tests du code existant HexGL, sans Node.js. QUnit est chargé localement. */
(function () {
  "use strict";
  if (typeof QUnit === "undefined") {
    document.documentElement.dataset.testStatus = "fail";
    document.documentElement.dataset.testCount = "0";
    document.documentElement.dataset.testFailures = "1";
    document.body.insertAdjacentHTML("afterbegin", "<p style='color:red'>QUnit introuvable : vérifiez le fichier vendor/qunit-2.26.0.js</p>");
    return;
  }

  // Compatible avec le script Chrome headless existant : état mesurable dans le DOM.
  QUnit.done(function (result) {
    const count = result.total;
    const failed = result.failed;
    const root = document.documentElement;
    root.setAttribute("data-test-count", String(count));
    root.setAttribute("data-test-failures", String(failed));
    root.setAttribute("data-test-status", failed === 0 && count >= 4 ? "pass" : "fail");
    let summary = document.getElementById("summary");
    if (!summary) {
      summary = document.createElement("p");
      summary.id = "summary";
      document.body.appendChild(summary);
    }
    summary.textContent = count + " test(s) : " + (count - failed) + " réussi(s), " + failed + " échec(s).";
  });

  const U = window.bkcore && window.bkcore.Utils;
  QUnit.module("HexGL — bkcore.Utils", function () {
    QUnit.test("updateClass ajoute une classe", function (assert) {
      assert.ok(U, "Utils.js chargé");
      const e = document.createElement("div");
      e.id = "test-hexgl-add";
      document.getElementById("qunit-fixture").appendChild(e);
      U.updateClass(e.id, "active", true);
      assert.true(e.classList.contains("active"));
    });
    QUnit.test("updateClass supprime une classe", function (assert) {
      assert.ok(U, "Utils.js chargé");
      const e = document.createElement("div");
      e.id = "test-hexgl-remove";
      e.className = "active";
      document.getElementById("qunit-fixture").appendChild(e);
      U.updateClass(e.id, "active", false);
      assert.false(e.classList.contains("active"));
    });
    QUnit.test("getOffsetTop additionne les décalages parent/enfant", function (assert) {
      const parent = {
        offsetTop: 37,
        offsetParent: null
      };
      const enfant = {
        offsetTop: 13,
        offsetParent: parent
      };
      assert.strictEqual(U.getOffsetTop(enfant), 50);
    });
    QUnit.test("getURLParameter lit les paramètres d'URL", function (assert) {
      assert.ok(U, "Utils.js chargé");
      U.URLParameters = null;
      const url = new URL(window.location.href);
      url.searchParams.set("hexgl_poc", "ok");
      // Le lanceur fournit hexgl_poc=ok ; en ouverture directe, on teste l'absence ou la présence.
      const expected = window.location.search.includes("hexgl_poc=ok") ? "ok" : null;
      assert.strictEqual(U.getURLParameter("hexgl_poc"), expected);
    });
  });

  const T = window.bkcore && window.bkcore.Timer;
  QUnit.module("HexGL — bkcore.Timer", function () {
    QUnit.test("msToTime décompose des millisecondes en h/m/s/ms", function (assert) {
      assert.ok(T, "Timer.js chargé");
      assert.deepEqual(T.msToTime(3723004), { h: 1, m: 2, s: 3, ms: 4 });
      assert.deepEqual(T.msToTime(0), { h: 0, m: 0, s: 0, ms: 0 });
    });
    QUnit.test("msToTimeString complète avec des zéros (h/m/s sur 2, ms sur 4)", function (assert) {
      assert.deepEqual(T.msToTimeString(3723004), { h: "01", m: "02", s: "03", ms: "0004" });
      assert.deepEqual(T.msToTimeString(92300), { h: "00", m: "01", s: "32", ms: "0300" });
    });
    QUnit.test("zfill complète sans tronquer", function (assert) {
      assert.strictEqual(T.zfill(7, 3), "007");
      assert.strictEqual(T.zfill(1234, 2), "1234");
      assert.strictEqual(T.zfill(0, 1), "0");
    });
    QUnit.test("un Timer est inactif à la création et ne progresse pas tant qu'il n'est pas démarré", function (assert) {
      const t = new T();
      assert.false(t.active);
      t.update();
      assert.strictEqual(t.time.elapsed, 0);
      assert.deepEqual(t.getElapsedTime(), { h: 0, m: 0, s: 0, ms: 0 });
    });
    QUnit.test("start active le timer, pause(true) le suspend et pause(false) le relance", function (assert) {
      const t = new T();
      t.start();
      assert.true(t.active);
      assert.strictEqual(t.time.elapsed, 0);
      t.pause(true);
      assert.false(t.active);
      t.pause(false);
      assert.true(t.active);
    });
    QUnit.test("update calcule le temps écoulé depuis start et getElapsedTime le formate", function (assert) {
      const t = new T();
      t.start();
      t.time.start -= 61500; // simule 1 min 1,5 s écoulée sans attendre
      t.update();
      assert.ok(t.time.elapsed >= 61500 && t.time.elapsed < 63000, "elapsed ≈ 61500 ms");
      const f = t.getElapsedTime();
      assert.strictEqual(f.m, 1);
      assert.strictEqual(f.s, 1);
    });
  });

  const I = window.bkcore && window.bkcore.ImageData;
  QUnit.module("HexGL — bkcore.ImageData (lecture de pixels)", function () {
    // Image 2x1 générée localement : pixel 0 = (10,20,30,255), pixel 1 = (200,100,50,255).
    function dataUrl() {
      const c = document.createElement("canvas");
      c.width = 2; c.height = 1;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "rgb(10,20,30)"; ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = "rgb(200,100,50)"; ctx.fillRect(1, 0, 1, 1);
      return c.toDataURL("image/png");
    }
    QUnit.test("getPixel renvoie un pixel nul tant que l'image n'est pas chargée", function (assert) {
      assert.ok(I, "ImageData.js chargé");
      const img = new I(dataUrl());
      assert.false(img.loaded);
      assert.deepEqual(img.getPixel(0, 0), { r: 0, g: 0, b: 0, a: 0 });
    });
    QUnit.test("getPixel lit les couleurs et renvoie un pixel nul hors limites", function (assert) {
      const done = assert.async();
      const img = new I(dataUrl(), function () {
        assert.true(this.loaded);
        assert.deepEqual(img.getPixel(0, 0), { r: 10, g: 20, b: 30, a: 255 });
        assert.deepEqual(img.getPixel(1, 0), { r: 200, g: 100, b: 50, a: 255 });
        assert.deepEqual(img.getPixel(-1, 0), { r: 0, g: 0, b: 0, a: 0 });
        assert.deepEqual(img.getPixel(2, 0), { r: 0, g: 0, b: 0, a: 0 });
        assert.deepEqual(img.getPixel(0, 1), { r: 0, g: 0, b: 0, a: 0 });
        done();
      });
    });
    QUnit.test("getPixelF encode RGB en entier (R + G*255 + B*255*255)", function (assert) {
      const done = assert.async();
      const img = new I(dataUrl(), function () {
        assert.strictEqual(img.getPixelF(0, 0), 10 + 20 * 255 + 30 * 255 * 255);
        assert.strictEqual(img.getPixelF(1, 0), 200 + 100 * 255 + 50 * 255 * 255);
        assert.strictEqual(img.getPixelF(5, 5), 0);
        done();
      });
    });
    QUnit.test("getPixelBilinear au centre d'un pixel renvoie sa couleur exacte", function (assert) {
      const done = assert.async();
      const img = new I(dataUrl(), function () {
        const c = img.getPixelBilinear(0.5, 0.5);
        assert.strictEqual(c.r, 10);
        assert.strictEqual(c.g, 20);
        assert.strictEqual(c.b, 30);
        done();
      });
    });
  });
})();
