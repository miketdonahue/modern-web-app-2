if ('fonts' in document) {
  const black = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-black.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-black.woff) format('woff')",
    { weight: '900' }
  );

  const bold = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-bold.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-bold.woff) format('woff')",
    { weight: '700' }
  );

  const medium = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-medium.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-medium.woff) format('woff')",
    { weight: '500' }
  );

  const regular = new FontFace(
    'Heebo',
    "url(/fonts/heebo/stage-2/heebo-regular.woff2) format('woff2'), url(/fonts/heebo/stage-2/heebo-regular.woff2) format('woff')",
    { weight: '400' }
  );

  Promise.all([black.load(), bold.load(), medium.load(), regular.load()]).then(
    function loadFonts(fonts) {
      fonts.forEach(function loadEachFont(font) {
        document.fonts.add(font);
      });
    }
  );
}
