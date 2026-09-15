'use strict';

/*
 * Protege bkcore.ImageData (bkcore.coffee/ImageData.js) : la lecture de
 * pixels sur une texture, utilisee par Gameplay.checkPoint() pour detecter
 * les checkpoints/collisions via une texture d'analyse. On instancie la
 * classe sans passer par son constructeur (qui depend de `Image`/DOM, non
 * disponible sous Node) en injectant directement un buffer de pixels.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const { bkcore } = require(path.join('..', 'bkcore.coffee', 'ImageData.js'));
const { ImageData } = bkcore;

// Construit une fausse image 2x2 avec des valeurs neutres/arbitraires,
// sans rapport avec une charte graphique ou un branding quelconque.
function makeImageData() {
  const width = 2;
  const height = 2;
  const data = [
    10, 20, 30, 255, // (0,0)
    40, 50, 60, 255, // (1,0)
    70, 80, 90, 255, // (0,1)
    100, 110, 120, 255 // (1,1)
  ];

  const instance = Object.create(ImageData.prototype);
  instance.pixels = { width, height, data };
  return instance;
}

test('getPixel renvoie du transparent noir hors-limites (gauche/haut/droite/bas)', () => {
  const img = makeImageData();
  const empty = { r: 0, g: 0, b: 0, a: 0 };
  assert.deepEqual(img.getPixel(-1, 0), empty);
  assert.deepEqual(img.getPixel(0, -1), empty);
  assert.deepEqual(img.getPixel(2, 0), empty);
  assert.deepEqual(img.getPixel(0, 2), empty);
});

test('getPixel renvoie les bonnes composantes RGBA a un index donne', () => {
  const img = makeImageData();
  assert.deepEqual(img.getPixel(0, 0), { r: 10, g: 20, b: 30, a: 255 });
  assert.deepEqual(img.getPixel(1, 1), { r: 100, g: 110, b: 120, a: 255 });
});

test('getPixelF encode R/G/B en un entier unique (R + G*255 + B*255*255)', () => {
  const img = makeImageData();
  const c = img.getPixel(0, 0);
  const expected = c.r + c.g * 255 + c.b * 255 * 255;
  assert.equal(img.getPixelF(0, 0), expected);
});

test('getPixelBilinear au centre exact d\'un pixel renvoie sa couleur brute', () => {
  const img = makeImageData();
  // x=0.5, y=0.5 correspond au centre du pixel (0,0): rx=ry=0 -> pas de melange
  assert.deepEqual(img.getPixelBilinear(0.5, 0.5), { r: 10, g: 20, b: 30, a: 255 });
});

test('getPixelBilinear interpole entre deux pixels voisins sur l\'axe X', () => {
  const img = makeImageData();
  // x=1.0 est a mi-chemin entre le pixel (0,0) [10,20,30] et (1,0) [40,50,60]
  const mid = img.getPixelBilinear(1.0, 0.5);
  assert.equal(mid.r, 25);
  assert.equal(mid.g, 35);
  assert.equal(mid.b, 45);
});
