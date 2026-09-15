'use strict';

/*
 * Protege branding/validateBranding.js : la validation pure du config
 * de branding (branding/config.js), consommee par branding/apply-branding.js
 * (etape suivante du plan). Fonction pure, sans DOM.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { branding } = require(path.join('..', 'branding', 'validateBranding.js'));
const { validate } = branding;

function validConfig() {
  return {
    name: 'ACME',
    welcomeMessage: 'Bienvenue au ACME Racing Challenge',
    logo: {
      src: 'branding/assets/acme-logo.png',
      alt: 'ACME'
    },
    colors: {
      background: '#08090D',
      accentPrimary: '#7628FF',
      accentSecondary: '#315BFF',
      accentTertiary: '#00C4E8',
      textOnDark: '#FFFFFF',
      surfaceSecondary: '#E6E8EE'
    }
  };
}

test('accepte une configuration complete et valide', () => {
  const result = validate(validConfig());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejette un config manquant ou non-objet', () => {
  assert.equal(validate(undefined).valid, false);
  assert.equal(validate(null).valid, false);
  assert.equal(validate('not an object').valid, false);
});

test('rejette un name manquant ou vide', () => {
  const config = validConfig();
  config.name = '';
  const result = validate(config);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.indexOf('name') !== -1));
});

test('rejette un welcomeMessage manquant', () => {
  const config = validConfig();
  delete config.welcomeMessage;
  const result = validate(config);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.indexOf('welcomeMessage') !== -1));
});

test('rejette un logo incomplet (src ou alt manquant)', () => {
  const missingSrc = validConfig();
  delete missingSrc.logo.src;
  assert.equal(validate(missingSrc).valid, false);

  const missingAlt = validConfig();
  missingAlt.logo.alt = '   ';
  assert.equal(validate(missingAlt).valid, false);
});

test('rejette une couleur non-hexadecimale', () => {
  const config = validConfig();
  config.colors.accentPrimary = 'violet';
  const result = validate(config);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.indexOf('colors.accentPrimary') !== -1));
});

test('rejette une couleur hexadecimale mal formee (raccourcie ou sans #)', () => {
  const shortHex = validConfig();
  shortHex.colors.background = '#FFF';
  assert.equal(validate(shortHex).valid, false);

  const noHash = validConfig();
  noHash.colors.background = '08090D';
  assert.equal(validate(noHash).valid, false);
});

test("rejette un objet colors auquel il manque une cle requise", () => {
  const config = validConfig();
  delete config.colors.surfaceSecondary;
  const result = validate(config);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.indexOf('colors.surfaceSecondary') !== -1));
});

test('signale toutes les erreurs en une seule passe (pas de court-circuit)', () => {
  const result = validate({
    name: '',
    welcomeMessage: '',
    logo: { src: '', alt: '' },
    colors: {}
  });
  assert.equal(result.valid, false);
  // name, welcomeMessage, logo.src, logo.alt + 6 couleurs manquantes = 10 erreurs
  assert.equal(result.errors.length, 10);
});
