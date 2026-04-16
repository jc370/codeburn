import { describe, expect, it } from 'vitest'
import { join } from 'path'
import { homedir } from 'os'

import { chooseMenubarPluginDir, parsePluginDirectoryPreference } from '../src/menubar.js'

describe('parsePluginDirectoryPreference', () => {
  it('trims defaults output and preserves spaces in paths', () => {
    expect(parsePluginDirectoryPreference('/Users/test/Documents/Tech stuff/swiftbar_plugins\n')).toBe('/Users/test/Documents/Tech stuff/swiftbar_plugins')
  })

  it('expands tilde paths', () => {
    expect(parsePluginDirectoryPreference('~/swiftbar_plugins')).toBe(join(homedir(), 'swiftbar_plugins'))
  })

  it('ignores blank preference values', () => {
    expect(parsePluginDirectoryPreference('  \n')).toBeUndefined()
  })
})

describe('chooseMenubarPluginDir', () => {
  const configuredSwiftBarDir = '/Users/test/Documents/Tech stuff/swiftbar_plugins'
  const defaultSwiftBarDir = '/Users/test/Library/Application Support/SwiftBar/plugins'
  const xbarDir = '/Users/test/Library/Application Support/xbar/plugins'

  it('uses SwiftBar configured plugin directory before the default directory', () => {
    const existing = new Set([configuredSwiftBarDir, defaultSwiftBarDir])
    const result = chooseMenubarPluginDir(
      [configuredSwiftBarDir, defaultSwiftBarDir],
      xbarDir,
      path => existing.has(path),
    )

    expect(result).toEqual({ pluginDir: configuredSwiftBarDir, appName: 'SwiftBar' })
  })

  it('falls back to xbar when no SwiftBar plugin directory exists', () => {
    const existing = new Set([xbarDir])
    const result = chooseMenubarPluginDir(
      [defaultSwiftBarDir],
      xbarDir,
      path => existing.has(path),
    )

    expect(result).toEqual({ pluginDir: xbarDir, appName: 'xbar' })
  })

  it('creates the preferred SwiftBar directory when no plugin directory exists', () => {
    const result = chooseMenubarPluginDir(
      [configuredSwiftBarDir, defaultSwiftBarDir],
      xbarDir,
      () => false,
    )

    expect(result).toEqual({ pluginDir: configuredSwiftBarDir, appName: 'SwiftBar' })
  })
})
