angular.module('localisationModule', ['ngLocalize', 'ngLocalize.Config', 'ngLocalize.Events', 'ngLocalize.InstalledLanguages']).value('localeConf', {
  basePath: 'styles/languages',
  defaultLocale: 'en-US',
  sharedDictionary: 'common',
  fileExtension: '.json',
  persistSelection: true,
  cookieName: 'COOKIE_LOCALE_LANG',
  observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
  delimiter: '::'
})
  .value('localeSupported', [
    'en-US',
    'fr-FR',
    
  ])
  .value('localeFallbacks', {
    'en': 'en-US',
    'fr': 'fr-FR'
  });

