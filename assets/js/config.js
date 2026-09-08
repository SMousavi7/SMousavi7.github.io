/* ============================================================================
   SITE CONFIGURATION
   ----------------------------------------------------------------------------
   This is the one file to edit to change which PDF the "Download CV" buttons
   hand over. Both buttons — the one in the navigation bar and the one in the
   hero — read from here.

   HOW TO SWAP IN YOUR OWN CV
   1. Drop the PDF into  assets/files/
   2. Put its path in `cvPath` below, written relative to index.html —
      so a file at assets/files/my-cv.pdf becomes 'assets/files/my-cv.pdf'.
      Keep the path relative (no leading slash): that way the site works the
      same whether it is served from smousavi7.github.io or from a subfolder.
   3. `cvFileName` is the name the file is saved under on the visitor's
      machine. It does not have to match the name on disk.

   Nothing else needs to change — the buttons pick this up on page load.
   ========================================================================== */

window.SITE = {

  // Path to the CV, relative to index.html.
  cvPath: 'assets/files/Sadra-Mousavi-CV.pdf',

  // Filename the visitor's browser saves it as.
  cvFileName: 'S-Sadra-Mousavi-CV.pdf',

};
