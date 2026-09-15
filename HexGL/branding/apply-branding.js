/*
 * Applique le branding evenementiel (ACME) a l'ecran d'accueil existant.
 *
 * Ne modifie ni le gameplay ni le comportement de bkcore/*: ce script ne
 * touche qu'aux noeuds DOM ajoutes par index.html (#brand-logo-panel,
 * #brand-name, #brand-welcome) et pose des custom properties CSS que
 * css/branding-acme.css consomme via var(..., fallback-original).
 *
 * Conception fail-open : toute erreur (config absente/invalide, validateur
 * indisponible, logo introuvable) est loguee en console et n'empeche jamais
 * l'ecran d'accueil de rester utilisable (le bouton Start n'est jamais
 * touche par ce script). Le chargement du logo est asynchrone (onload/
 * onerror) : son propre try/catch garantit que le fail-open s'applique
 * aussi a cette partie, pas seulement a l'execution synchrone initiale.
 */
(function() {
  function setBrandColor(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  function show(el) {
    if (el) {
      el.classList.add('is-visible');
    }
  }

  function fillText(id, value) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = value;
      show(el);
    }
  }

  function applyLogo(config) {
    var logoImg = document.getElementById('brand-logo');
    var logoPanel = document.getElementById('brand-logo-panel');
    var originalTitle = document.getElementById('title');
    if (!logoImg || !logoPanel) {
      return;
    }

    logoImg.onerror = function() {
      try {
        console.warn('[branding] logo introuvable (' + config.logo.src + '), panneau logo masque, logo HexGL d\'origine conserve.');
        logoPanel.classList.remove('is-visible');
      } catch (e) {
        console.warn('[branding] echec du repli sur le logo HexGL d\'origine:', e);
      }
    };
    logoImg.onload = function() {
      try {
        show(logoPanel);
        // Le logo ACME ne remplace le logo HexGL d'origine qu'une fois
        // charge avec succes, pour garantir qu'un logo reste toujours visible.
        if (originalTitle) {
          originalTitle.classList.add('is-branded');
        }
      } catch (e) {
        console.warn('[branding] echec de l\'affichage du logo ACME:', e);
      }
    };
    logoImg.alt = config.logo.alt;
    logoImg.src = config.logo.src;
  }

  try {
    var config = window.HexGLBranding;
    var validate = window.branding && window.branding.validate;

    if (typeof validate !== 'function') {
      console.warn('[branding] validateBranding indisponible, habillage ACME ignore.');
      return;
    }

    var result = validate(config);
    if (!result.valid) {
      console.warn('[branding] config de branding invalide, habillage ACME ignore:', result.errors);
      return;
    }

    var colors = config.colors;
    setBrandColor('--brand-color-background', colors.background);
    setBrandColor('--brand-color-surface', colors.surfaceSecondary);
    setBrandColor('--brand-color-text', colors.textOnDark);
    setBrandColor('--brand-color-text-on-dark', colors.textOnDark);
    setBrandColor('--brand-color-accent', colors.accentPrimary);

    fillText('brand-name', config.name);
    fillText('brand-welcome', config.welcomeMessage);

    applyLogo(config);
  } catch (e) {
    console.warn('[branding] echec de l\'application du branding, ecran d\'accueil inchange:', e);
  }
})();
