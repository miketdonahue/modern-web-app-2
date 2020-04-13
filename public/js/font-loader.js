if ('fonts' in document) {
  const extraBold = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-extra-bold.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-extra-bold.woff) format('woff')",
    { weight: '800' }
  );

  const bold = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-bold.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-bold.woff) format('woff')",
    { weight: '700' }
  );

  const regular = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-regular.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-regular.woff2) format('woff')",
    { weight: '400' }
  );

  Promise.all([extraBold.load(), bold.load(), regular.load()]).then(
    function loadFonts(fonts) {
      fonts.forEach(function loadEachFont(font) {
        document.fonts.add(font);
      });
    }
  );
}
