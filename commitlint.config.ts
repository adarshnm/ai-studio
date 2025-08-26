import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'chore', // general maintenance (deps, config, cleanup)
        'docs', // documentation only (README, docs app)
        'style', // formatting (eslint/prettier, whitespace, no logic)
        'refactor', // code change that improves structure without features/fixes
        'test', // adding or fixing tests
        'build', // build system or dependency changes
        'perf', // performance improvements
      ],
    ],
  },
  // ...
}

export default Configuration
