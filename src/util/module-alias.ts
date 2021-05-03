/**
 * This file is used to alias the module to convert '@src' to '/src' and '@test' to '/test'.
 */
import * as path from 'path';
import moduleAlias from 'module-alias';

const files = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test')
});
