import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default antfu(
  {
    rules: {
      'no-alert': 'off',
    },
  },
  unocss.configs.flat,
)
