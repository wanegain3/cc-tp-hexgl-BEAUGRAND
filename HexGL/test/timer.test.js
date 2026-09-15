'use strict';

/*
 * Protege bkcore.Timer (bkcore.coffee/Timer.js) : les conversions
 * millisecondes -> h/m/s/ms utilisees pour l'affichage des temps de course
 * et du classement (HUD, Ladder). Ce sont des fonctions pures, sans DOM.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { bkcore } = require(path.join('..', 'bkcore.coffee', 'Timer.js'));
const { Timer } = bkcore;

test('msToTime decompose 0ms en zero partout', () => {
  assert.deepEqual(Timer.msToTime(0), { h: 0, m: 0, s: 0, ms: 0 });
});

test('msToTime decompose correctement heures/minutes/secondes/ms', () => {
  // 1h 01m 01s 234ms
  const t = Timer.msToTime(3661234);
  assert.equal(t.h, 1);
  assert.equal(t.m, 1);
  assert.equal(t.s, 1);
  assert.equal(t.ms, 234);
});

test('msToTime fait deborder les minutes/heures au-dela de 60', () => {
  // 125000ms = 2min 5s
  const t = Timer.msToTime(125000);
  assert.equal(t.h, 0);
  assert.equal(t.m, 2);
  assert.equal(t.s, 5);
  assert.equal(t.ms, 0);
});

test('msToTimeString ajoute les zeros de tete (h/m/s sur 2, ms sur 4)', () => {
  const t = Timer.msToTimeString(5000);
  assert.deepEqual(t, { h: '00', m: '00', s: '05', ms: '0000' });
});

test('msToTimeString ne tronque pas une valeur plus longue que la taille demandee', () => {
  // 3600000 + 999ms => h=1 -> "01", ms=999 -> "0999"
  const t = Timer.msToTimeString(3600999);
  assert.equal(t.h, '01');
  assert.equal(t.ms, '0999');
});

test('zfill complete avec des zeros jusqu\'a la taille voulue', () => {
  assert.equal(Timer.zfill(5, 2), '05');
  assert.equal(Timer.zfill(42, 4), '0042');
});

test('zfill ne tronque jamais un nombre deja plus long que la taille demandee', () => {
  assert.equal(Timer.zfill(12345, 2), '12345');
});
